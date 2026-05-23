import { ReceiptText } from "lucide-react"
import { ComprobanteEstadoSunatBadge } from "@/modules/comprobantes/components/ComprobanteEstadoSunatBadge"
import type { ComprobanteElectronico } from "@/modules/comprobantes/types/comprobante.types"
import { getComprobanteClienteNombre, getComprobanteTotal } from "@/modules/comprobantes/types/comprobante.types"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatCurrency, formatDateTime } from "@/modules/caja/components/cajaFormatters"

type Props = { comprobante: ComprobanteElectronico }

export function ComprobanteDetailHeader({ comprobante }: Props) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ReceiptText className="h-5 w-5 text-indigo-600" />
            <h1 className="text-2xl font-semibold tracking-tight">{comprobante.numero_comprobante}</h1>
            <Badge variant="secondary">{comprobante.tipo_comprobante.replaceAll("_", " ")}</Badge>
            <ComprobanteEstadoSunatBadge estado={comprobante.estado_sunat} />
          </div>
          <p className="text-sm text-muted-foreground">{formatDateTime(comprobante.fecha_emision)} | {getComprobanteClienteNombre(comprobante)}</p>
        </div>
        <div className="text-left lg:text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold">{formatCurrency(getComprobanteTotal(comprobante))}</p>
        </div>
      </CardContent>
    </Card>
  )
}