import type { ComprobanteElectronico, ComprobanteVentaDetalle } from "@/modules/comprobantes/types/comprobante.types"
import { getComprobanteDescuento, getComprobanteIgv, getComprobanteSubtotal, getComprobanteTotal } from "@/modules/comprobantes/types/comprobante.types"
import type { NotaCreditoFormValues } from "@/modules/comprobantes/notas-credito/schemas/notaCredito.schema"
import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"

function originalQuantity(detalle: ComprobanteVentaDetalle) {
  return Number(detalle.cantidad_presentacion ?? detalle.cantidad ?? 0) || 1
}

function calculate(detalles: ComprobanteVentaDetalle[], values: NotaCreditoFormValues, comprobante?: ComprobanteElectronico | null) {
  if (detalles.length === 0 && comprobante) {
    return {
      subtotal: getComprobanteSubtotal(comprobante),
      descuento: getComprobanteDescuento(comprobante),
      igv: getComprobanteIgv(comprobante),
      total: getComprobanteTotal(comprobante),
    }
  }

  const selected = values.tipo_nota === "TOTAL"
    ? detalles.map((detalle) => ({ venta_detalle_id: detalle.id, cantidad: originalQuantity(detalle) }))
    : values.detalles

  return selected.reduce((totals, item) => {
    const detalle = detalles.find((row) => row.id === Number(item.venta_detalle_id))
    if (!detalle) return totals
    const factor = Number(item.cantidad || 0) / originalQuantity(detalle)
    return {
      subtotal: totals.subtotal + Number(detalle.subtotal ?? 0) * factor,
      descuento: totals.descuento + Number(detalle.descuento ?? 0) * factor,
      igv: totals.igv + Number(detalle.igv ?? 0) * factor,
      total: totals.total + Number(detalle.total ?? 0) * factor,
    }
  }, { subtotal: 0, descuento: 0, igv: 0, total: 0 })
}

export function NotaCreditoTotalesPreview({ detalles, values, comprobante }: { detalles: ComprobanteVentaDetalle[]; values: NotaCreditoFormValues; comprobante?: ComprobanteElectronico | null }) {
  const totals = calculate(detalles, values, comprobante)
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Vista previa referencial</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
        <Row label="Descuento" value={formatCurrency(totals.descuento)} />
        <Row label="IGV" value={formatCurrency(totals.igv)} />
        <Separator />
        <Row label="Total" value={formatCurrency(totals.total)} strong />
        <p className="text-xs text-muted-foreground">El backend recalcula y valida los importes finales con los datos originales de la venta.</p>
      </CardContent>
    </Card>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className={strong ? "flex justify-between text-lg font-semibold" : "flex justify-between text-sm"}><span className="text-muted-foreground">{label}</span><span>{value}</span></div>
}
