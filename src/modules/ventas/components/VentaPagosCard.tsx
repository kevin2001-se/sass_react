import type { VentaPago } from "@/modules/ventas/types/venta.types"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { formatCurrency, formatMetodoPago } from "@/modules/caja/components/cajaFormatters"

type VentaPagosCardProps = { pagos?: VentaPago[] }

export function VentaPagosCard({ pagos = [] }: VentaPagosCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pagos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay pagos registrados.</p>
        ) : (
          pagos.map((pago) => (
            <div key={pago.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <div>
                <Badge variant="secondary">{formatMetodoPago(pago.metodo_pago)}</Badge>
                {pago.referencia ? <p className="mt-1 text-xs text-muted-foreground">Ref. {pago.referencia}</p> : null}
              </div>
              <span className="font-semibold">{formatCurrency(pago.monto)}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}