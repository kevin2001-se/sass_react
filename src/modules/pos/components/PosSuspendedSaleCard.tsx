import { memo } from "react"
import { CalendarClock, RotateCcw, Trash2 } from "lucide-react"

import { PosResumeSuspendedSaleDialog } from "@/modules/pos/components/PosResumeSuspendedSaleDialog"
import type { PosSuspendedSale } from "@/modules/pos/types/pos.types"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { formatCurrency, formatDateTime } from "@/modules/caja/components/cajaFormatters"

function clienteName(sale: PosSuspendedSale) {
  return sale.cliente?.razon_social || sale.cliente?.nombres || "Clientes varios"
}

type PosSuspendedSaleCardProps = {
  sale: PosSuspendedSale
  hasCurrentItems: boolean
  onResume: (id: string) => void
  onDelete: (id: string) => void
}

export const PosSuspendedSaleCard = memo(function PosSuspendedSaleCard({ sale, hasCurrentItems, onResume, onDelete }: PosSuspendedSaleCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">{clienteName(sale)}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              {formatDateTime(sale.updated_at)}
            </p>
          </div>
          <Badge variant="secondary">{sale.tipoComprobante}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div><p className="text-muted-foreground">Productos</p><p className="font-medium">{sale.items.length}</p></div>
          <div><p className="text-muted-foreground">Pagos</p><p className="font-medium">{sale.pagos.length}</p></div>
          <div><p className="text-muted-foreground">Total</p><p className="font-semibold">{formatCurrency(sale.total)}</p></div>
        </div>
        {sale.observacion ? <p className="line-clamp-2 text-xs text-muted-foreground">{sale.observacion}</p> : null}
        <Separator />
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => onDelete(sale.id)}>
            <Trash2 className="mr-2 h-4 w-4" />Eliminar
          </Button>
          <PosResumeSuspendedSaleDialog hasCurrentItems={hasCurrentItems} onConfirm={() => onResume(sale.id)}>
            <Button size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />Recuperar
            </Button>
          </PosResumeSuspendedSaleDialog>
        </div>
      </CardContent>
    </Card>
  )
})
