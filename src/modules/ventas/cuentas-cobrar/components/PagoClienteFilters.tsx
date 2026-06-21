import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import type { PagoClienteFilters } from "../types/cuentaCobrar.types"
const clean = (v: string) => v === "TODOS" ? undefined : v
export function PagoClienteFilters({ filters, onChange }: { filters: PagoClienteFilters; onChange: (filters: PagoClienteFilters) => void }) {
  const update = (key: keyof PagoClienteFilters, value: unknown) => onChange({ ...filters, [key]: value, page: 1 })
  return <div className="grid gap-4 md:grid-cols-4"><div className="space-y-2"><Label>Metodo</Label><Select value={filters.metodo_pago ?? "TODOS"} onValueChange={(v) => update("metodo_pago", clean(v))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TODOS">Todos</SelectItem><SelectItem value="EFECTIVO">Efectivo</SelectItem><SelectItem value="YAPE">Yape</SelectItem><SelectItem value="PLIN">Plin</SelectItem><SelectItem value="TARJETA">Tarjeta</SelectItem><SelectItem value="TRANSFERENCIA">Transferencia</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Desde</Label><Input type="date" value={filters.fecha_inicio ?? ""} onChange={(e) => update("fecha_inicio", e.target.value || undefined)} /></div><div className="space-y-2"><Label>Hasta</Label><Input type="date" value={filters.fecha_fin ?? ""} onChange={(e) => update("fecha_fin", e.target.value || undefined)} /></div><div className="space-y-2"><Label>Cuenta</Label><Input value={filters.cuenta_por_cobrar_id ?? ""} onChange={(e) => update("cuenta_por_cobrar_id", e.target.value || undefined)} placeholder="ID cuenta" /></div></div>
}
