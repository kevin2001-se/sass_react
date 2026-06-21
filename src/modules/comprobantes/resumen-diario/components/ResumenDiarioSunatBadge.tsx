import { Badge } from "@/shared/components/ui/badge"

import type { ResumenDiarioEstadoSunat } from "../types/resumenDiario.types"

const estadoSunatClasses: Record<string, string> = {
  PENDIENTE: "border-slate-200 bg-slate-50 text-slate-700",
  ENVIADO: "border-sky-200 bg-sky-50 text-sky-700",
  ACEPTADO: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RECHAZADO: "border-red-200 bg-red-50 text-red-700",
  ERROR: "border-amber-200 bg-amber-50 text-amber-700",
}

export function ResumenDiarioSunatBadge({ estado }: { estado?: ResumenDiarioEstadoSunat | string | null }) {
  const value = estado ?? "PENDIENTE"

  return (
    <Badge variant="outline" className={estadoSunatClasses[value] ?? estadoSunatClasses.PENDIENTE}>
      {value}
    </Badge>
  )
}