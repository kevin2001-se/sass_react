import type { PosSunatEstado } from "@/modules/pos/types/pos.types"
import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/utils/cn"

const styles: Record<PosSunatEstado, string> = {
  ACEPTADO: "bg-emerald-600 text-white hover:bg-emerald-600",
  RECHAZADO: "bg-destructive text-destructive-foreground hover:bg-destructive",
  ERROR: "bg-destructive text-destructive-foreground hover:bg-destructive",
  PENDIENTE: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  ENVIADO: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  DADO_DE_BAJA: "bg-slate-700 text-white hover:bg-slate-700",
  NO_APLICA: "bg-muted text-muted-foreground hover:bg-muted",
}

export function PosSunatStatusBadge({ estado }: { estado?: PosSunatEstado | string | null }) {
  const normalized = (estado ?? "NO_APLICA") as PosSunatEstado
  const label = normalized === "NO_APLICA" ? "No aplica SUNAT" : normalized

  return <Badge className={cn(styles[normalized] ?? styles.NO_APLICA)}>{label}</Badge>
}
