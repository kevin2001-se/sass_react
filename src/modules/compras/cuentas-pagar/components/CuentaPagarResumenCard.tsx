import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import type { CuentaPagar } from "@/modules/compras/cuentas-pagar/types/cuentaPagar.types"

function money(value?: number | string | null) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(value ?? 0))
}

function Item({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">{label}</span><span className={strong ? "font-semibold" : "font-medium"}>{value}</span></div>
}

export function CuentaPagarResumenCard({ cuenta }: { cuenta: CuentaPagar }) {
  return (
    <Card>
      <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Item label="Total" value={money(cuenta.monto_total)} />
        <Item label="Pagado" value={money(cuenta.monto_pagado)} />
        <Item label="Saldo pendiente" value={money(cuenta.saldo_pendiente ?? cuenta.saldo)} strong />
      </CardContent>
    </Card>
  )
}