import { Receipt } from "lucide-react"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { formatQuantity } from "@/modules/pos/utils/posCalculations"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"

export function PosSummary() {
  const { subtotal, totalDescuento, totalIgv, total, totalItems, cantidadProductos, totalPagado, saldoPendiente, vuelto } = usePosStore()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Receipt className="h-4 w-4" />
          Resumen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <Row label="Productos" value={`${cantidadProductos}`} />
        <Row label="Cantidad" value={formatQuantity(totalItems)} />
        <Separator />
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        <Row label="Descuento" value={formatCurrency(totalDescuento)} />
        <Row label="IGV" value={formatCurrency(totalIgv)} />
        <Separator />
        <Row label="Pagado" value={formatCurrency(totalPagado)} />
        <Row label="Pendiente" value={formatCurrency(saldoPendiente)} />
        {vuelto > 0 && <Row label="Vuelto" value={formatCurrency(vuelto)} />}
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <span className="text-base font-semibold">Total</span>
          <span className="text-right text-3xl font-bold text-primary">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
