import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/utils/cn"
import type { NotaCreditoEstado } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"

const styles: Record<string, string> = { BORRADOR: "border-slate-200 bg-slate-50 text-slate-700", REGISTRADA: "border-emerald-200 bg-emerald-50 text-emerald-700", ANULADA: "border-red-200 bg-red-50 text-red-700" }

export function NotaCreditoEstadoBadge({ estado }: { estado?: NotaCreditoEstado | string | null }) {
  const value = estado || "BORRADOR"
  return <Badge variant="outline" className={cn("font-medium", styles[value] ?? styles.BORRADOR)}>{value}</Badge>
}