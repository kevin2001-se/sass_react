import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import type { CuentaCobrar } from "../types/cuentaCobrar.types"
import { getSaldoCuenta, toNumber } from "../types/cuentaCobrar.types"
const money = (v?: number | string | null) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(toNumber(v))
export function CuentaCobrarResumenCard({ cuenta }: { cuenta: CuentaCobrar }) {
  return <div className="grid gap-4 md:grid-cols-3">
    <Card><CardHeader><CardTitle className="text-sm">Total</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{money(cuenta.monto_total)}</CardContent></Card>
    <Card><CardHeader><CardTitle className="text-sm">Pagado</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{money(cuenta.monto_pagado)}</CardContent></Card>
    <Card><CardHeader><CardTitle className="text-sm">Saldo</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{money(getSaldoCuenta(cuenta))}</CardContent></Card>
  </div>
}
