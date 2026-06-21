import { Badge } from "@/shared/components/ui/badge"

import type { ComunicacionBajaEstadoSunat } from "../types/comunicacionBaja.types"

const variants: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-700 border-amber-200",
  ENVIADO: "bg-blue-100 text-blue-700 border-blue-200",
  ACEPTADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
  RECHAZADO: "bg-red-100 text-red-700 border-red-200",
  ERROR: "bg-red-100 text-red-700 border-red-200",
}

export function ComunicacionBajaSunatBadge({ estado }: { estado?: ComunicacionBajaEstadoSunat | null }) {
  const value = estado ?? "PENDIENTE"
  return <Badge variant="outline" className={variants[String(value)] ?? "bg-muted text-muted-foreground"}>{value}</Badge>
}
