import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import type { PagoProveedorFilters as Filters } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"

type Props = { filters: Filters; onChange: (filters: Filters) => void }

export function PagoProveedorFilters({ filters, onChange }: Props) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch, page: 1 })
  return (
    <div className="grid gap-3 md:grid-cols-5">
      <Input type="date" value={filters.fecha_inicio ?? ""} onChange={(e) => update({ fecha_inicio: e.target.value || undefined })} aria-label="Fecha inicio" />
      <Input type="date" value={filters.fecha_fin ?? ""} onChange={(e) => update({ fecha_fin: e.target.value || undefined })} aria-label="Fecha fin" />
      <Input value={filters.proveedor_id ?? ""} onChange={(e) => update({ proveedor_id: e.target.value || undefined })} placeholder="ID proveedor" aria-label="Proveedor" />
      <Select value={filters.estado ?? "TODOS"} onValueChange={(value) => update({ estado: value === "TODOS" ? undefined : value })}>
        <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos</SelectItem>
          <SelectItem value="REGISTRADO">Registrado</SelectItem>
          <SelectItem value="ANULADO">Anulado</SelectItem>
        </SelectContent>
      </Select>
      <Button type="button" variant="outline" onClick={() => onChange({ page: 1, per_page: filters.per_page ?? 15 })}>Limpiar</Button>
    </div>
  )
}