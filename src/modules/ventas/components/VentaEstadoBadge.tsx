import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/utils/cn"
import type { VentaEstado } from "@/modules/ventas/types/venta.types"

type VentaEstadoBadgeProps = {
  estado?: VentaEstado | string | null
}

const styles: Record<string, string> = {
  REGISTRADA: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ANULADA: "border-red-200 bg-red-50 text-red-700",
  DEVUELTA: "border-amber-200 bg-amber-50 text-amber-700",
}

export function VentaEstadoBadge({ estado }: VentaEstadoBadgeProps) {
  const value = estado ?? "-"

  return (
    <Badge variant="outline" className={cn("font-medium", styles[value] ?? "border-muted text-muted-foreground")}>
      {value.replaceAll("_", " ")}
    </Badge>
  )
}