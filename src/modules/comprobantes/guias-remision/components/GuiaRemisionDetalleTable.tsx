import type { GuiaRemisionDetalle } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

function formatNumber(value?: number | string | null, digits = 4) {
  const number = Number(value ?? 0)
  return Number.isFinite(number) ? number.toFixed(digits) : "-"
}

export function GuiaRemisionDetalleTable({ detalles = [] }: { detalles?: GuiaRemisionDetalle[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detalle de productos</CardTitle>
      </CardHeader>
      <CardContent>
        {detalles.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">La guia no tiene detalles.</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripcion</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Peso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detalles.map((detalle) => (
                  <TableRow key={detalle.id}>
                    <TableCell className="font-medium">{detalle.descripcion}</TableCell>
                    <TableCell>{detalle.unidad_medida}</TableCell>
                    <TableCell className="text-right">{formatNumber(detalle.cantidad)}</TableCell>
                    <TableCell className="text-right">{detalle.peso !== null && detalle.peso !== undefined ? formatNumber(detalle.peso, 3) : "-"}</TableCell>
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
