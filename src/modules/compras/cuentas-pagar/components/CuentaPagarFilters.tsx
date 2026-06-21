import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import type { CuentaPagarFilters as Filters } from "@/modules/compras/cuentas-pagar/types/cuentaPagar.types"

type Props = { filters: Filters; onChange: (filters: Filters) => void }

export function CuentaPagarFilters({ filters, onChange }: Props) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch, page: 1 })

  return (
    <div className="grid gap-3 md:grid-cols-5">
      <Input type="date" value={filters.fecha_inicio ?? ""} onChange={(event) => update({ fecha_inicio: event.target.value || undefined })} aria-label="Fecha inicio" />
      <Input type="date" value={filters.fecha_fin ?? ""} onChange={(event) => update({ fecha_fin: event.target.value || undefined })} aria-label="Fecha fin" />
      <Input value={filters.proveedor_id ?? ""} onChange={(event) => update({ proveedor_id: event.target.value || undefined })} placeholder="ID proveedor" aria-label="Proveedor" />
      <Select value={filters.estado ?? "TODOS"} onValueChange={(value) => update({ estado: value === "TODOS" ? undefined : value, vencidas: value === "VENCIDO" ? true : undefined })}>
        <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos</SelectItem>
          <SelectItem value="PENDIENTE">Pendiente</SelectItem>
          <SelectItem value="PARCIAL">Parcial</SelectItem>
          <SelectItem value="PAGADO">Pagado</SelectItem>
          <SelectItem value="VENCIDO">Vencido</SelectItem>
          <SelectItem value="ANULADO">Anulado</SelectItem>
        </SelectContent>
      </Select>
      <Button type="button" variant="outline" onClick={() => onChange({ page: 1, per_page: filters.per_page ?? 15 })}>Limpiar</Button>
    </div>
  )
}