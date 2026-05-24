import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/utils/cn"

const styles: Record<string, string> = { PENDIENTE: "border-amber-200 bg-amber-50 text-amber-700", ENVIADO: "border-sky-200 bg-sky-50 text-sky-700", ACEPTADO: "border-emerald-200 bg-emerald-50 text-emerald-700", RECHAZADO: "border-red-200 bg-red-50 text-red-700", ERROR: "border-red-200 bg-red-50 text-red-700" }

export function NotaCreditoSunatBadge({ estado }: { estado?: string | null }) {
  const value = estado || "PENDIENTE"
  return <Badge variant="outline" className={cn("font-medium", styles[value] ?? styles.PENDIENTE)}>{value}</Badge>
}