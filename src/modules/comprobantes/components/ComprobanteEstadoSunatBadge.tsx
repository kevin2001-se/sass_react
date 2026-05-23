import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/utils/cn"
import type { EstadoSunat } from "@/modules/comprobantes/types/comprobante.types"

type Props = { estado?: EstadoSunat | string | null }

const styles: Record<string, string> = {
  ACEPTADO: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RECHAZADO: "border-red-200 bg-red-50 text-red-700",
  ERROR: "border-red-200 bg-red-50 text-red-700",
  PENDIENTE: "border-amber-200 bg-amber-50 text-amber-700",
  ENVIADO: "border-sky-200 bg-sky-50 text-sky-700",
  DADO_DE_BAJA: "border-slate-300 bg-slate-100 text-slate-700",
  NO_APLICA: "border-muted bg-muted text-muted-foreground",
}

export function ComprobanteEstadoSunatBadge({ estado }: Props) {
  const value = estado ?? "NO_APLICA"
  return <Badge variant="outline" className={cn("font-medium", styles[value] ?? styles.NO_APLICA)}>{value.replaceAll("_", " ")}</Badge>
}