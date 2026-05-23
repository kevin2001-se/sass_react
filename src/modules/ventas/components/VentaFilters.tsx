import { Search, RotateCcw } from "lucide-react"

import type { VentaFilters as VentaFiltersType } from "@/modules/ventas/types/venta.types"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

type VentaFiltersProps = {
  filters: VentaFiltersType
  onChange: (filters: VentaFiltersType) => void
  onReset: () => void
}

function setSelectValue(value?: string) {
  return value && value !== "" ? value : "TODOS"
}

function cleanSelectValue(value: string) {
  return value === "TODOS" ? "" : value
}

export function VentaFilters({ filters, onChange, onReset }: VentaFiltersProps) {
  const update = (key: keyof VentaFiltersType, value: string) => {
    onChange({ ...filters, [key]: value, page: 1 })
  }

  return (
    <Card>
      <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_inicio">Fecha inicio</Label>
          <Input id="fecha_inicio" type="date" value={filters.fecha_inicio ?? ""} onChange={(event) => update("fecha_inicio", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_fin">Fecha fin</Label>
          <Input id="fecha_fin" type="date" value={filters.fecha_fin ?? ""} onChange={(event) => update("fecha_fin", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Tipo comprobante</Label>
          <Select value={setSelectValue(filters.tipo_comprobante)} onValueChange={(value) => update("tipo_comprobante", cleanSelectValue(value))}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="NOTA_VENTA">Nota venta</SelectItem>
              <SelectItem value="BOLETA">Boleta</SelectItem>
              <SelectItem value="FACTURA">Factura</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo venta</Label>
          <Select value={setSelectValue(filters.tipo_venta)} onValueChange={(value) => update("tipo_venta", cleanSelectValue(value))}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="CONTADO">Contado</SelectItem>
              <SelectItem value="CREDITO">Credito</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select value={setSelectValue(filters.estado)} onValueChange={(value) => update("estado", cleanSelectValue(value))}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="REGISTRADA">Registrada</SelectItem>
              <SelectItem value="ANULADA">Anulada</SelectItem>
              <SelectItem value="DEVUELTA">Devuelta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Metodo pago</Label>
          <Select value={setSelectValue(filters.metodo_pago)} onValueChange={(value) => update("metodo_pago", cleanSelectValue(value))}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="EFECTIVO">Efectivo</SelectItem>
              <SelectItem value="YAPE">Yape</SelectItem>
              <SelectItem value="PLIN">Plin</SelectItem>
              <SelectItem value="TARJETA">Tarjeta</SelectItem>
              <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          <Input id="cliente" value={filters.cliente ?? ""} onChange={(event) => update("cliente", event.target.value)} placeholder="Nombre o documento" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numero_comprobante">Comprobante</Label>
          <div className="flex gap-2">
            <Input id="numero_comprobante" value={filters.numero_comprobante ?? ""} onChange={(event) => update("numero_comprobante", event.target.value)} placeholder="B001-00000015" />
            <Button type="button" variant="outline" size="icon" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-end xl:col-span-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            Los filtros se aplican sobre la tienda activa actual.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}