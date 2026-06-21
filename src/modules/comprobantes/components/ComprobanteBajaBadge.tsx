import { Badge } from "@/shared/components/ui/badge"

const classes: Record<string, string> = {
  SIN_BAJA: "border-slate-200 bg-slate-50 text-slate-700",
  PENDIENTE_BAJA: "border-amber-200 bg-amber-50 text-amber-700",
  EN_BAJA: "border-sky-200 bg-sky-50 text-sky-700",
  BAJA_ACEPTADA: "border-emerald-200 bg-emerald-50 text-emerald-700",
  BAJA_RECHAZADA: "border-red-200 bg-red-50 text-red-700",
}

export function ComprobanteBajaBadge({ estado }: { estado?: string | null }) {
  const value = estado || "SIN_BAJA"
  return <Badge variant="outline" className={classes[value] ?? classes.SIN_BAJA}>{value.replaceAll("_", " ")}</Badge>
}