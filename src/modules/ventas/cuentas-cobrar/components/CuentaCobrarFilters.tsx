import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import type { CuentaCobrarFilters } from "../types/cuentaCobrar.types"
const clean = (value: string) => value === "TODOS" ? undefined : value
export function CuentaCobrarFilters({ filters, onChange }: { filters: CuentaCobrarFilters; onChange: (filters: CuentaCobrarFilters) => void }) {
  const update = (key: keyof CuentaCobrarFilters, value: unknown) => onChange({ ...filters, [key]: value, page: 1 })
  return <div className="grid gap-4 md:grid-cols-5">
    <div className="space-y-2"><Label>Estado</Label><Select value={filters.estado ?? "TODOS"} onValueChange={(v) => update("estado", clean(v))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TODOS">Todos</SelectItem><SelectItem value="PENDIENTE">Pendiente</SelectItem><SelectItem value="PARCIAL">Parcial</SelectItem><SelectItem value="PAGADO">Pagado</SelectItem><SelectItem value="VENCIDO">Vencido</SelectItem><SelectItem value="ANULADO">Anulado</SelectItem></SelectContent></Select></div>
    <div className="space-y-2"><Label>Desde</Label><Input type="date" value={filters.fecha_inicio ?? ""} onChange={(e) => update("fecha_inicio", e.target.value || undefined)} /></div>
    <div className="space-y-2"><Label>Hasta</Label><Input type="date" value={filters.fecha_fin ?? ""} onChange={(e) => update("fecha_fin", e.target.value || undefined)} /></div>
    <div className="space-y-2"><Label>Comprobante</Label><Input value={filters.numero_comprobante ?? ""} onChange={(e) => update("numero_comprobante", e.target.value || undefined)} placeholder="B001-00000001" /></div>
    <div className="space-y-2"><Label>Vencidas</Label><Select value={filters.vencidas ? "SI" : "TODOS"} onValueChange={(v) => update("vencidas", v === "SI" ? true : undefined)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TODOS">Todas</SelectItem><SelectItem value="SI">Solo vencidas</SelectItem></SelectContent></Select></div>
  </div>
}
