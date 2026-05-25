import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import type { CompraDetalleFormValues } from "@/modules/compras/compras/types/compra.types"

type CompraTotalesCardProps = {
  detalles: CompraDetalleFormValues[]
}

function money(value: number) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number.isFinite(value) ? value : 0)
}

export function CompraTotalesCard({ detalles }: CompraTotalesCardProps) {
  const subtotalBruto = detalles.reduce((sum, item) => sum + Number(item.cantidad_presentacion || 0) * Number(item.costo_unitario || 0), 0)
  const descuento = detalles.reduce((sum, item) => sum + Number(item.descuento || 0), 0)
  const total = Math.max(subtotalBruto - descuento, 0)

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base">Totales referenciales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3"><span className="min-w-0 text-muted-foreground">Subtotal bruto</span><span className="shrink-0 text-right">{money(subtotalBruto)}</span></div>
        <div className="flex items-center justify-between gap-3"><span className="min-w-0 text-muted-foreground">Descuento</span><span className="shrink-0 text-right">{money(descuento)}</span></div>
        <div className="flex items-center justify-between gap-3 border-t pt-3 text-lg font-semibold"><span>Total</span><span className="shrink-0 text-right">{money(total)}</span></div>
        <p className="text-xs leading-5 text-muted-foreground">El backend recalcula subtotal, IGV y total antes de registrar la compra.</p>
      </CardContent>
    </Card>
  )
}
