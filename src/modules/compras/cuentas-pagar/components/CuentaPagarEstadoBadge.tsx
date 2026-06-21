import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/utils/cn"
import type { CuentaPagarEstado } from "@/modules/compras/cuentas-pagar/types/cuentaPagar.types"

const styles: Record<string, string> = {
  PENDIENTE: "border-amber-200 bg-amber-50 text-amber-700",
  PARCIAL: "border-blue-200 bg-blue-50 text-blue-700",
  PAGADO: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PAGADA: "border-emerald-200 bg-emerald-50 text-emerald-700",
  VENCIDO: "border-red-200 bg-red-50 text-red-700",
  ANULADO: "border-slate-200 bg-slate-50 text-slate-600",
  ANULADA: "border-slate-200 bg-slate-50 text-slate-600",
}

export function CuentaPagarEstadoBadge({ estado }: { estado: CuentaPagarEstado }) {
  return <Badge variant="outline" className={cn("w-fit", styles[estado] ?? styles.PENDIENTE)}>{estado}</Badge>
}