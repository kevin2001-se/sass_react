import { CheckCircle2, CircleAlert } from "lucide-react"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"

export function PosPaymentSummary() {
  const total = usePosStore((state) => state.total)
  const totalPagado = usePosStore((state) => state.totalPagado)
  const saldoPendiente = usePosStore((state) => state.saldoPendiente)
  const vuelto = usePosStore((state) => state.vuelto)
  const puedeCobrar = usePosStore((state) => state.puedeCobrar)
  const tipoVenta = usePosStore((state) => state.tipoVenta)

  return (
    <div className="space-y-2 rounded-md border p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Total venta</span>
        <span className="font-semibold">{formatCurrency(total)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{tipoVenta === "CREDITO" ? "Pago inicial" : "Pagado"}</span>
        <span className="font-semibold">{formatCurrency(totalPagado)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{tipoVenta === "CREDITO" ? "Saldo pendiente" : "Pendiente"}</span>
        <span className="font-semibold">{formatCurrency(saldoPendiente)}</span>
      </div>
      {vuelto > 0 && (
        <div className="rounded-md bg-emerald-50 p-2 text-emerald-700">
          <div className="flex items-center justify-between">
            <span className="font-medium">Vuelto</span>
            <span className="text-xl font-bold">{formatCurrency(vuelto)}</span>
          </div>
        </div>
      )}
      <Separator />
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Estado</span>
        {puedeCobrar ? (
          <Badge className="bg-emerald-600 text-white"><CheckCircle2 className="h-3.5 w-3.5" /> Listo</Badge>
        ) : tipoVenta === "CREDITO" ? (
          <Badge variant="secondary">Credito pendiente</Badge>
        ) : (
          <Badge variant="outline"><CircleAlert className="h-3.5 w-3.5" /> Falta pagar</Badge>
        )}
      </div>
    </div>
  )
}
