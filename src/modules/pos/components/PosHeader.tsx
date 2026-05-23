import { ArrowLeft, Keyboard, Store } from "lucide-react"
import { Link } from "react-router-dom"

import type { Caja } from "@/modules/caja/types/caja.types"
import { PosShortcutHelp } from "@/modules/pos/components/PosShortcutHelp"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { useAuthStore } from "@/shared/stores/auth.store"

type PosHeaderProps = {
  caja?: Caja | null
  isCajaLoading?: boolean
}

export function PosHeader({ caja, isCajaLoading }: PosHeaderProps) {
  const empresa = useAuthStore((state) => state.empresa)
  const tiendaActiva = useAuthStore((state) => state.tiendaActiva)

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-3 md:px-4">
      <Button asChild size="icon" variant="ghost" title="Volver">
        <Link to="/dashboard">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </Button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{empresa?.nombre ?? empresa?.razon_social ?? "Empresa"}</p>
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <Store className="h-3.5 w-3.5" />
          <span className="truncate">{tiendaActiva?.nombre ?? "Sin tienda activa"}</span>
        </div>
      </div>
      {isCajaLoading ? (
        <Badge variant="outline">Verificando caja</Badge>
      ) : caja ? (
        <Badge className="bg-emerald-600 text-white">Caja abierta</Badge>
      ) : (
        <Badge className="bg-destructive text-destructive-foreground">Sin caja</Badge>
      )}
      <PosShortcutHelp>
        <Button size="icon" variant="outline" title="Atajos">
          <Keyboard className="h-4 w-4" />
        </Button>
      </PosShortcutHelp>
    </header>
  )
}

