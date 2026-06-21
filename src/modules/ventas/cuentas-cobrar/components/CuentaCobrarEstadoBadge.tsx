import { Badge } from "@/shared/components/ui/badge"
export function CuentaCobrarEstadoBadge({ estado }: { estado?: string | null }) {
  const value = estado || "PENDIENTE"
  const cls = value === "PAGADO" || value === "PAGADA" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : value === "PARCIAL" ? "border-blue-200 bg-blue-50 text-blue-700" : value === "VENCIDO" || value === "VENCIDA" ? "border-red-200 bg-red-50 text-red-700" : value === "ANULADO" || value === "ANULADA" ? "border-slate-200 bg-slate-50 text-slate-600" : "border-amber-200 bg-amber-50 text-amber-700"
  return <Badge variant="outline" className={cls}>{value}</Badge>
}
