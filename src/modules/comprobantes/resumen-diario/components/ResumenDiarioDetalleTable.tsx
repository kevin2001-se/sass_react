import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

import { ResumenDiarioAccionBadge } from "./ResumenDiarioAccionBadge"
import type { ResumenDiarioDetalle } from "../types/resumenDiario.types"
import { toNumber } from "../types/resumenDiario.types"

const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" })

export function ResumenDiarioDetalleTable({ detalles = [] }: { detalles?: ResumenDiarioDetalle[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos incluidos</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Accion</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Numero</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Motivo baja</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">IGV</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detalles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  No hay documentos incluidos en este resumen.
                </TableCell>
              </TableRow>
            ) : (
              detalles.map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell><ResumenDiarioAccionBadge accion={detalle.accion} /></TableCell>
                  <TableCell className="font-medium">{detalle.tipo_documento}</TableCell>
                  <TableCell>{detalle.numero_completo ?? detalle.numero_comprobante ?? `${detalle.serie ?? ""}-${detalle.correlativo ?? ""}`}</TableCell>
                  <TableCell>
                    <div className="font-medium">{detalle.cliente_nombre ?? "Cliente varios"}</div>
                    <div className="text-xs text-muted-foreground">{detalle.cliente_numero_documento ?? "Sin documento"}</div>
                  </TableCell>
                  <TableCell>{detalle.estado_documento ?? detalle.estado_item ?? "-"}</TableCell>
                  <TableCell className="max-w-[220px] truncate text-muted-foreground" title={detalle.motivo_baja ?? undefined}>
                    {detalle.accion === "BAJA" ? detalle.motivo_baja ?? "Baja interna pendiente" : "-"}
                  </TableCell>
                  <TableCell className="text-right">{currency.format(toNumber(detalle.subtotal))}</TableCell>
                  <TableCell className="text-right">{currency.format(toNumber(detalle.total_igv))}</TableCell>
                  <TableCell className="text-right font-semibold">{currency.format(toNumber(detalle.total))}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}