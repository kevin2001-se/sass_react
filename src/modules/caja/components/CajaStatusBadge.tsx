import { Badge } from "@/shared/components/ui/badge"
import type { CajaEstado } from "@/modules/caja/types/caja.types"

export function CajaStatusBadge({ estado }: { estado: CajaEstado }) {
  return (
    <Badge className={estado === "ABIERTA" ? "bg-emerald-600 text-white" : undefined} variant={estado === "ABIERTA" ? "default" : "outline"}>
      {estado === "ABIERTA" ? "Abierta" : "Cerrada"}
    </Badge>
  )
}

export function DiferenciaBadge({ diferencia }: { diferencia?: number | null }) {
  const value = Number(diferencia ?? 0)
  if (value > 0) return <Badge className="bg-emerald-600 text-white">Sobrante</Badge>
  if (value < 0) return <Badge className="bg-destructive text-destructive-foreground">Faltante</Badge>
  return <Badge variant="secondary">Cuadrado</Badge>
}
