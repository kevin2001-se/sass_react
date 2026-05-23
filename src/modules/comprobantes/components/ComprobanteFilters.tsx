import type { ComprobanteFilters as Filters } from "@/modules/comprobantes/types/comprobante.types"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

type Props = { filters: Filters; onChange: (filters: Filters) => void; onReset: () => void; fixedTipo?: string }

const anyValue = "TODOS"
const selectValue = (value?: string) => value && value !== "" ? value : anyValue
const clean = (value: string) => value === anyValue ? "" : value

export function ComprobanteFilters({ filters, onChange, onReset, fixedTipo }: Props) {
  const update = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value, page: 1 })

  return (
    <Card>
      <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label>Fecha inicio</Label>
          <Input type="date" value={filters.fecha_inicio ?? ""} onChange={(e) => update("fecha_inicio", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Fecha fin</Label>
          <Input type="date" value={filters.fecha_fin ?? ""} onChange={(e) => update("fecha_fin", e.target.value)} />
        </div>
        {!fixedTipo ? (
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={selectValue(filters.tipo_comprobante)} onValueChange={(value) => update("tipo_comprobante", clean(value))}>
              <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={anyValue}>Todos</SelectItem>
                <SelectItem value="BOLETA">Boleta</SelectItem>
                <SelectItem value="FACTURA">Factura</SelectItem>
                <SelectItem value="NOTA_CREDITO">Nota credito</SelectItem>
                <SelectItem value="NOTA_DEBITO">Nota debito</SelectItem>
                <SelectItem value="GUIA_REMISION">Guia remision</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="space-y-2">
          <Label>Estado SUNAT</Label>
          <Select value={selectValue(filters.estado_sunat)} onValueChange={(value) => update("estado_sunat", clean(value))}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={anyValue}>Todos</SelectItem>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
              <SelectItem value="ENVIADO">Enviado</SelectItem>
              <SelectItem value="ACEPTADO">Aceptado</SelectItem>
              <SelectItem value="RECHAZADO">Rechazado</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
              <SelectItem value="DADO_DE_BAJA">Dado de baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Serie</Label>
          <Input value={filters.serie ?? ""} onChange={(e) => update("serie", e.target.value)} placeholder="B001" />
        </div>
        <div className="space-y-2">
          <Label>Numero</Label>
          <Input value={filters.numero ?? ""} onChange={(e) => update("numero", e.target.value)} placeholder="00000012" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Cliente</Label>
          <div className="flex gap-2">
            <Input value={filters.cliente ?? ""} onChange={(e) => update("cliente", e.target.value)} placeholder="Nombre, razon social o documento" />
            <Button type="button" variant="outline" onClick={onReset}>Limpiar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}