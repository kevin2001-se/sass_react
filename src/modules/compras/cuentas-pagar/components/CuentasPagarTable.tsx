import { Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { CuentaPagarEstadoBadge } from "@/modules/compras/cuentas-pagar/components/CuentaPagarEstadoBadge"
import type { CuentaPagar } from "@/modules/compras/cuentas-pagar/types/cuentaPagar.types"

function money(value?: number | string | null) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(value ?? 0))
}

export function CuentasPagarTable({ cuentas }: { cuentas: CuentaPagar[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Compra</TableHead>
            <TableHead>Emision</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Pagado</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cuentas.map((cuenta) => (
            <TableRow key={cuenta.id}>
              <TableCell className="min-w-56 font-medium">{cuenta.proveedor?.razon_social ?? "-"}</TableCell>
              <TableCell>{cuenta.compra?.numero_documento ?? `#${cuenta.compra_id}`}</TableCell>
              <TableCell>{cuenta.fecha_emision ?? "-"}</TableCell>
              <TableCell>{cuenta.fecha_vencimiento ?? "-"}</TableCell>
              <TableCell className="text-right font-semibold">{money(cuenta.monto_total)}</TableCell>
              <TableCell className="text-right">{money(cuenta.monto_pagado)}</TableCell>
              <TableCell className="text-right font-semibold">{money(cuenta.saldo_pendiente ?? cuenta.saldo)}</TableCell>
              <TableCell><CuentaPagarEstadoBadge estado={cuenta.estado} /></TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" asChild aria-label="Ver detalle de cuenta por pagar"><Link to={`/compras/cuentas-por-pagar/${cuenta.id}`}><Eye className="h-4 w-4" /></Link></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}