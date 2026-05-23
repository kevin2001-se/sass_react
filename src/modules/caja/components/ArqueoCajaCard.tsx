import { DiferenciaBadge } from "@/modules/caja/components/CajaStatusBadge"
import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import type { ArqueoCaja } from "@/modules/caja/types/caja.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"

export function ArqueoCajaCard({ arqueo }: { arqueo: ArqueoCaja }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Arqueo de caja</CardTitle>
        <DiferenciaBadge diferencia={arqueo.diferencia} />
      </CardHeader>
      <CardContent className="grid gap-3 text-sm md:grid-cols-2">
        <Item label="Monto apertura" value={formatCurrency(arqueo.monto_apertura)} />
        <Item label="Ingresos efectivo" value={formatCurrency(arqueo.ingresos_efectivo)} />
        <Item label="Ingresos Yape" value={formatCurrency(arqueo.ingresos_yape)} />
        <Item label="Ingresos Plin" value={formatCurrency(arqueo.ingresos_plin)} />
        <Item label="Ingresos tarjeta" value={formatCurrency(arqueo.ingresos_tarjeta)} />
        <Item label="Ingresos transferencia" value={formatCurrency(arqueo.ingresos_transferencia)} />
        <Separator className="md:col-span-2" />
        <Item label="Total ingresos" value={formatCurrency(arqueo.total_ingresos)} />
        <Item label="Total egresos" value={formatCurrency(arqueo.total_egresos)} />
        <Item label="Saldo sistema" value={formatCurrency(arqueo.saldo_sistema)} strong />
        <Item label="Monto real" value={formatCurrency(arqueo.monto_real)} strong />
        <Item label="Diferencia" value={formatCurrency(arqueo.diferencia)} strong />
      </CardContent>
    </Card>
  )
}

function Item({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-semibold" : "font-medium"}>{value}</span>
    </div>
  )
}
