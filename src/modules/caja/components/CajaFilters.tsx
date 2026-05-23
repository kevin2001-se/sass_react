import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

type CajaFiltersProps = {
  fechaInicio: string
  fechaFin: string
  estado: string
  onFechaInicioChange: (value: string) => void
  onFechaFinChange: (value: string) => void
  onEstadoChange: (value: string) => void
}

export function CajaFilters({ fechaInicio, fechaFin, estado, onFechaInicioChange, onFechaFinChange, onEstadoChange }: CajaFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="space-y-2">
        <Label>Desde</Label>
        <Input type="date" value={fechaInicio} onChange={(event) => onFechaInicioChange(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Hasta</Label>
        <Input type="date" value={fechaFin} onChange={(event) => onFechaFinChange(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Estado</Label>
        <Select value={estado || "todos"} onValueChange={(value) => onEstadoChange(value === "todos" ? "" : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ABIERTA">Abierta</SelectItem>
            <SelectItem value="CERRADA">Cerrada</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
