import { Badge } from "@/shared/components/ui/badge"
import type { GuiaRemisionEstado } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"

const styles: Record<string, string> = {
  BORRADOR: "border-slate-200 bg-slate-50 text-slate-700",
  REGISTRADA: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ANULADA: "border-red-200 bg-red-50 text-red-700",
}

export function GuiaRemisionEstadoBadge({ estado }: { estado?: GuiaRemisionEstado | string | null }) {
  const value = estado || "BORRADOR"
  return <Badge variant="outline" className={styles[value] ?? styles.BORRADOR}>{value}</Badge>
}
