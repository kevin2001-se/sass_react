import { Badge } from "@/shared/components/ui/badge"

import type { ResumenDiarioEstado } from "../types/resumenDiario.types"

const estadoClasses: Record<string, string> = {
  BORRADOR: "border-slate-200 bg-slate-50 text-slate-700",
  REGISTRADO: "border-indigo-200 bg-indigo-50 text-indigo-700",
  REGISTRADA: "border-indigo-200 bg-indigo-50 text-indigo-700",
  ANULADO: "border-red-200 bg-red-50 text-red-700",
  ANULADA: "border-red-200 bg-red-50 text-red-700",
}

export function ResumenDiarioEstadoBadge({ estado }: { estado?: ResumenDiarioEstado | string | null }) {
  const value = estado ?? "PENDIENTE"

  return (
    <Badge variant="outline" className={estadoClasses[value] ?? "border-slate-200 bg-slate-50 text-slate-700"}>
      {value}
    </Badge>
  )
}