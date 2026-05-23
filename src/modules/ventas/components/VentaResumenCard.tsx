import type { Venta } from "@/modules/ventas/types/venta.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { formatCurrency } from "@/modules/caja/components/cajaFormatters"

type VentaResumenCardProps = { venta: Venta }

export function VentaResumenCard({ venta }: VentaResumenCardProps) {
  const igv = venta.total_igv ?? venta.igv ?? 0
  const descuento = venta.total_descuento ?? venta.descuento ?? 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Subtotal" value={formatCurrency(venta.subtotal)} />
        <Row label="Descuento" value={formatCurrency(descuento)} />
        <Row label="IGV" value={formatCurrency(igv)} />
        <Separator />
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(venta.total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>
}