import { Badge } from "@/shared/components/ui/badge"
import type { NotaDebitoEstadoSunat } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"

const styles: Record<string, string> = {
  PENDIENTE: "border-amber-200 bg-amber-50 text-amber-700",
  ENVIADO: "border-blue-200 bg-blue-50 text-blue-700",
  ACEPTADO: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RECHAZADO: "border-red-200 bg-red-50 text-red-700",
  ERROR: "border-red-200 bg-red-50 text-red-700",
}

export function NotaDebitoSunatBadge({ estado }: { estado?: NotaDebitoEstadoSunat | string | null }) {
  const value = estado || "PENDIENTE"
  return <Badge variant="outline" className={styles[value] ?? "text-muted-foreground"}>{value}</Badge>
}