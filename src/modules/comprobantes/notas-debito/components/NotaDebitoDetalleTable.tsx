import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import type { NotaDebitoDetalle } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { numberValue } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

export function NotaDebitoDetalleTable({ detalles }: { detalles: NotaDebitoDetalle[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Detalles</CardTitle></CardHeader>
      <CardContent>
        {detalles.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">La nota no tiene detalles registrados.</div>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead>Descripcion</TableHead><TableHead className="text-right">Cantidad</TableHead><TableHead className="text-right">Precio</TableHead><TableHead className="text-right">Subtotal</TableHead><TableHead className="text-right">IGV</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
              <TableBody>
                {detalles.map((detalle) => (
                  <TableRow key={detalle.id}>
                    <TableCell className="font-medium">{detalle.descripcion}</TableCell>
                    <TableCell className="text-right">{numberValue(detalle.cantidad).toFixed(4)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(numberValue(detalle.precio_unitario))}</TableCell>
                    <TableCell className="text-right">{formatCurrency(numberValue(detalle.subtotal))}</TableCell>
                    <TableCell className="text-right">{formatCurrency(numberValue(detalle.igv))}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(numberValue(detalle.total))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}