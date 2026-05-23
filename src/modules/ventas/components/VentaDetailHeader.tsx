import { CalendarClock, ReceiptText, User } from "lucide-react"

import { VentaEstadoBadge } from "@/modules/ventas/components/VentaEstadoBadge"
import type { Venta } from "@/modules/ventas/types/venta.types"
import { getVentaClienteNombre } from "@/modules/ventas/types/venta.types"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { formatDateTime } from "@/modules/caja/components/cajaFormatters"

type VentaDetailHeaderProps = { venta: Venta }

export function VentaDetailHeader({ venta }: VentaDetailHeaderProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ReceiptText className="h-5 w-5 text-indigo-600" />
            <h1 className="text-2xl font-semibold tracking-tight">{venta.numero_comprobante}</h1>
            <Badge variant="secondary">{venta.tipo_comprobante.replaceAll("_", " ")}</Badge>
            <VentaEstadoBadge estado={venta.estado} />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CalendarClock className="h-4 w-4" />{formatDateTime(venta.fecha_emision)}</span>
            <span className="flex items-center gap-2"><User className="h-4 w-4" />{venta.usuario?.name ?? venta.user?.name ?? "-"}</span>
          </div>
        </div>
        <Separator className="lg:hidden" />
        <div className="grid gap-1 text-sm lg:text-right">
          <span className="text-muted-foreground">Cliente</span>
          <span className="font-medium">{getVentaClienteNombre(venta.cliente)}</span>
          <span className="text-muted-foreground">{venta.tipo_venta}</span>
        </div>
      </CardContent>
    </Card>
  )
}