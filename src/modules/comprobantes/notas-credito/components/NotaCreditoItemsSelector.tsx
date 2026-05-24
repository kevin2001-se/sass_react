import type { ComprobanteVentaDetalle } from "@/modules/comprobantes/types/comprobante.types"
import type { NotaCreditoFormValues } from "@/modules/comprobantes/notas-credito/schemas/notaCredito.schema"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { formatCurrency } from "@/modules/caja/components/cajaFormatters"

function quantity(detalle: ComprobanteVentaDetalle) {
  return Number(detalle.cantidad_disponible_devolucion ?? detalle.cantidad_presentacion ?? detalle.cantidad ?? 0)
}

function isSelected(values: NotaCreditoFormValues["detalles"], id: number) {
  return values.some((item) => Number(item.venta_detalle_id) === id)
}

type Props = {
  detalles: ComprobanteVentaDetalle[]
  tipoNota: "TOTAL" | "PARCIAL"
  value: NotaCreditoFormValues["detalles"]
  onChange: (value: NotaCreditoFormValues["detalles"]) => void
  error?: string
}

export function NotaCreditoItemsSelector({ detalles, tipoNota, value, onChange, error }: Props) {
  function toggle(detalle: ComprobanteVentaDetalle, checked: boolean) {
    if (checked) {
      onChange([...value, { venta_detalle_id: detalle.id, cantidad: Math.min(1, quantity(detalle)) || 1 }])
      return
    }
    onChange(value.filter((item) => Number(item.venta_detalle_id) !== detalle.id))
  }

  function updateCantidad(detalleId: number, cantidad: number) {
    onChange(value.map((item) => Number(item.venta_detalle_id) === detalleId ? { ...item, cantidad } : item))
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Items de la nota</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {detalles.length === 0 ? <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">El comprobante no tiene detalles disponibles.</div> : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead className="w-12">Sel.</TableHead><TableHead>Producto</TableHead><TableHead className="text-right">Disponible</TableHead><TableHead className="text-right">Cantidad NC</TableHead><TableHead className="text-right">Precio</TableHead><TableHead className="text-right">Total original</TableHead></TableRow></TableHeader>
              <TableBody>{detalles.map((detalle) => {
                const selected = tipoNota === "TOTAL" || isSelected(value, detalle.id)
                const selectedValue = value.find((item) => Number(item.venta_detalle_id) === detalle.id)
                const max = quantity(detalle)
                return <TableRow key={detalle.id}><TableCell><Checkbox checked={selected} disabled={tipoNota === "TOTAL" || max <= 0} onCheckedChange={(checked) => toggle(detalle, Boolean(checked))} /></TableCell><TableCell><p className="font-medium">{detalle.descripcion}</p><p className="text-xs text-muted-foreground">{detalle.producto?.nombre ?? "Producto manual"}</p></TableCell><TableCell className="text-right">{max.toFixed(4)}</TableCell><TableCell className="text-right"><Input className="ml-auto h-9 w-28 text-right" type="number" min="0.0001" step="0.0001" max={max} disabled={tipoNota === "TOTAL" || !selected || max <= 0} value={tipoNota === "TOTAL" ? max : selectedValue?.cantidad ?? ""} onChange={(event) => updateCantidad(detalle.id, Number(event.target.value))} /></TableCell><TableCell className="text-right">{formatCurrency(detalle.precio_unitario ?? 0)}</TableCell><TableCell className="text-right font-semibold">{formatCurrency(detalle.total ?? 0)}</TableCell></TableRow>
              })}</TableBody>
            </Table>
          </div>
        )}
        {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  )
}