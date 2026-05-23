import { CalendarClock, UserRound, Wallet } from "lucide-react"

import type { ArqueoCaja, Caja } from "@/modules/caja/types/caja.types"
import { formatCurrency, formatDateTime } from "@/modules/caja/components/cajaFormatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

type CajaResumenCardProps = {
  caja: Caja
  arqueo?: ArqueoCaja | null
}

export function CajaResumenCard({ caja, arqueo }: CajaResumenCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Metric title="Monto apertura" value={formatCurrency(caja.monto_apertura)} icon={Wallet} />
      <Metric title="Saldo sistema" value={formatCurrency(arqueo?.saldo_sistema ?? caja.monto_cierre_sistema)} icon={Wallet} />
      <Metric title="Fecha apertura" value={formatDateTime(caja.fecha_apertura)} icon={CalendarClock} />
      <Metric title="Usuario apertura" value={caja.user_apertura?.name ?? "-"} icon={UserRound} />
    </div>
  )
}

function Metric({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Wallet }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}
