import { Trash2 } from "lucide-react"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { formatMetodoPago } from "@/modules/pos/utils/posPaymentCalculations"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

export function PosPaymentList() {
  const pagos = usePosStore((state) => state.pagos)
  const removePago = usePosStore((state) => state.removePago)

  if (pagos.length === 0) {
    return <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">Aun no hay pagos agregados.</div>
  }

  return (
    <div className="space-y-2">
      {pagos.map((pago) => (
        <div className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm" key={pago.id}>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{formatMetodoPago(pago.metodo_pago)}</Badge>
              <span className="font-semibold">{formatCurrency(pago.monto)}</span>
            </div>
            {pago.referencia && <p className="mt-1 truncate text-xs text-muted-foreground">Ref: {pago.referencia}</p>}
          </div>
          <Button size="icon" type="button" variant="ghost" onClick={() => removePago(pago.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
