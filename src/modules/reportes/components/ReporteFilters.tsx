import type { ReporteFilters as Filters } from "@/modules/reportes/types/reporte.types"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

type ReporteFiltersProps = {
  filters: Filters
  onChange: (filters: Filters) => void
  showEstado?: boolean
  estados?: string[]
}

export function ReporteFilters({ filters, onChange, showEstado = true, estados = ["REGISTRADA", "ANULADA"] }: ReporteFiltersProps) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch, page: 1 })

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="fecha_inicio">Fecha inicio</Label>
        <Input id="fecha_inicio" type="date" value={filters.fecha_inicio ?? ""} onChange={(event) => update({ fecha_inicio: event.target.value || undefined })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_fin">Fecha fin</Label>
        <Input id="fecha_fin" type="date" value={filters.fecha_fin ?? ""} onChange={(event) => update({ fecha_fin: event.target.value || undefined })} />
      </div>
      {showEstado ? (
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select value={filters.estado ?? "TODOS"} onValueChange={(value) => update({ estado: value === "TODOS" ? undefined : value })}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>{estado}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <div className="flex items-end">
        <Button variant="outline" onClick={() => onChange({ page: 1, per_page: filters.per_page ?? 15 })}>
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}
