import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

import type { ResumenDiarioFilters as Filters } from "../types/resumenDiario.types"

export function ResumenDiarioFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
  onClear: () => void
}) {
  const update = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value, page: 1 })

  return (
    <Card>
      <CardContent className="grid gap-4 p-4 md:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="fecha_inicio">Desde</Label>
          <Input id="fecha_inicio" type="date" value={filters.fecha_inicio ?? ""} onChange={(event) => update("fecha_inicio", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_fin">Hasta</Label>
          <Input id="fecha_fin" type="date" value={filters.fecha_fin ?? ""} onChange={(event) => update("fecha_fin", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select value={filters.estado ?? "TODOS"} onValueChange={(value) => update("estado", value)}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="REGISTRADO">Registrado</SelectItem>
              <SelectItem value="ANULADO">Anulado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Estado SUNAT</Label>
          <Select value={filters.estado_sunat ?? "TODOS"} onValueChange={(value) => update("estado_sunat", value)}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
              <SelectItem value="ENVIADO">Enviado</SelectItem>
              <SelectItem value="ACEPTADO">Aceptado</SelectItem>
              <SelectItem value="RECHAZADO">Rechazado</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="identificador">Identificador</Label>
          <div className="flex gap-2">
            <Input
              id="identificador"
              placeholder="RC-20260524-001"
              value={filters.identificador ?? ""}
              onChange={(event) => update("identificador", event.target.value)}
            />
            <Button type="button" variant="outline" onClick={onClear}>Limpiar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}