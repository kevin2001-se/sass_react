import { Badge } from "@/shared/components/ui/badge"

import type { ComunicacionBajaEstado } from "../types/comunicacionBaja.types"

const variants: Record<string, string> = {
  REGISTRADA: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ANULADA: "bg-slate-100 text-slate-700 border-slate-200",
}

export function ComunicacionBajaEstadoBadge({ estado }: { estado?: ComunicacionBajaEstado | null }) {
  const value = estado ?? "-"
  return <Badge variant="outline" className={variants[String(value)] ?? "bg-muted text-muted-foreground"}>{value}</Badge>
}
