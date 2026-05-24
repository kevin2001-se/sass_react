import { Badge } from "@/shared/components/ui/badge"
import type { NotaDebitoEstado } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"

const styles: Record<string, string> = {
  BORRADOR: "border-slate-200 bg-slate-50 text-slate-700",
  REGISTRADA: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ANULADA: "border-red-200 bg-red-50 text-red-700",
}

export function NotaDebitoEstadoBadge({ estado }: { estado?: NotaDebitoEstado | string | null }) {
  const value = estado || "BORRADOR"
  return <Badge variant="outline" className={styles[value] ?? "text-muted-foreground"}>{value}</Badge>
}