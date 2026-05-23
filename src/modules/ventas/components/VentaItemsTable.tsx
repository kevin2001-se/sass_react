import type { VentaDetalle } from "@/modules/ventas/types/venta.types"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { formatCurrency } from "@/modules/caja/components/cajaFormatters"

type VentaItemsTableProps = { detalles?: VentaDetalle[] }

export function VentaItemsTable({ detalles = [] }: VentaItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        {detalles.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            No hay productos registrados en esta venta.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Presentacion</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Descuento</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detalles.map((detalle) => (
                  <TableRow key={detalle.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{detalle.descripcion ?? detalle.producto?.nombre}</p>
                        <p className="text-xs text-muted-foreground">Base: {Number(detalle.cantidad_base).toFixed(2)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{detalle.presentacion?.nombre ?? `#${detalle.producto_presentacion_id}`}</TableCell>
                    <TableCell>
                      {detalle.lote ? <Badge variant="outline">{detalle.lote.codigo_lote}</Badge> : <span className="text-muted-foreground">Sin lote</span>}
                    </TableCell>
                    <TableCell className="text-right">{Number(detalle.cantidad_presentacion).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(detalle.precio_unitario)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(detalle.descuento)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(detalle.total)}</TableCell>
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