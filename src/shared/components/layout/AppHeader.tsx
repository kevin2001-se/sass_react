import { Store } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { useLogout } from "@/modules/auth/hooks/use-auth"
import { useSeleccionarTienda } from "@/modules/auth/hooks/use-tiendas"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { authService } from "@/shared/services/auth.service"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { useAuthStore } from "@/shared/stores/auth.store"

export function AppHeader() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logoutMutation = useLogout()
  const seleccionarTiendaMutation = useSeleccionarTienda()
  const {
    empresa,
    tiendaActiva,
    tiendasDisponibles,
    user,
    clearSession,
    setSessionFromApi,
  } = useAuthStore()

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // Si el token ya expirÃ³, igual cerramos sesiÃ³n localmente.
    } finally {
      clearSession()
      navigate("/login", { replace: true })
    }
  }

  async function handleChangeTienda(value: string) {
    if (tiendaActiva?.id === Number(value)) {
      return
    }

    try {
      await seleccionarTiendaMutation.mutateAsync(Number(value))
      const freshSession = await authService.me()
      setSessionFromApi(freshSession)
      await queryClient.invalidateQueries()

      toast.success("Tienda activa actualizada.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo cambiar de tienda."))
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {empresa?.nombre ?? empresa?.razon_social ?? "Empresa Demo"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {tiendaActiva?.nombre ?? "Sin tienda activa"}
        </p>
      </div>

      <div className="hidden w-64 md:block">
        <div className="relative">
          <Store className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 text-muted-foreground" />
          <AppCombobox
            className="pl-9"
            disabled={seleccionarTiendaMutation.isPending}
            value={tiendaActiva?.id ?? null}
            onChange={(value) => value !== null && handleChangeTienda(String(value))}
            options={tiendasDisponibles.map((tienda) => ({ value: tienda.id, label: tienda.nombre, description: tienda.direccion }))}
            placeholder="Seleccionar tienda"
            searchPlaceholder="Buscar tienda..."
            emptyMessage="No hay tiendas disponibles"
            allowClear={false}
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-indigo-100 text-indigo-700">
                {user?.name?.slice(0, 2).toUpperCase() ?? "US"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user?.name ?? "Usuario"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Mi perfil</DropdownMenuItem>
          <DropdownMenuItem>Preferencias</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={logoutMutation.isPending} onClick={handleLogout}>
            Cerrar sesiÃ³n
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

