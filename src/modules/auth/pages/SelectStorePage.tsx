import { Building2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { useSeleccionarTienda } from "@/modules/auth/hooks/use-tiendas"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { authService } from "@/shared/services/auth.service"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { useAuthStore } from "@/shared/stores/auth.store"

export function SelectStorePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const seleccionarTiendaMutation = useSeleccionarTienda()
  const { isAuthenticated, tiendasDisponibles, setSessionFromApi } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  async function handleSelect(tiendaId: number) {
    try {
      await seleccionarTiendaMutation.mutateAsync(tiendaId)
      const freshSession = await authService.me()
      setSessionFromApi(freshSession)
      await queryClient.invalidateQueries()

      toast.success("Tienda activa actualizada.")
      navigate("/dashboard", { replace: true })
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo seleccionar la tienda."))
    }
  }

  return (
    <Card className="w-full border-border/80 shadow-sm">
      <CardHeader>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="h-5 w-5" />
        </div>
        <CardTitle className="text-2xl">Selecciona una tienda</CardTitle>
        <CardDescription>
          Tu sesión usará esta tienda para ventas, caja, inventario y compras.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {seleccionarTiendaMutation.error && (
          <Alert variant="destructive">
            <AlertDescription>
              {getLaravelErrorMessage(seleccionarTiendaMutation.error)}
            </AlertDescription>
          </Alert>
        )}

        {tiendasDisponibles.length === 0 ? (
          <div className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">
            No tienes tiendas asignadas. Solicita acceso al administrador.
          </div>
        ) : (
          tiendasDisponibles.map((tienda) => (
            <Button
              className="h-auto w-full justify-start gap-3 p-4"
              disabled={seleccionarTiendaMutation.isPending}
              key={tienda.id}
              type="button"
              variant="outline"
              onClick={() => handleSelect(tienda.id)}
            >
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-left">
                <span className="block font-medium">{tienda.nombre}</span>
                <span className="block text-xs text-muted-foreground">
                  {tienda.direccion ?? "Sin dirección registrada"}
                </span>
              </span>
            </Button>
          ))
        )}
      </CardContent>
    </Card>
  )
}
