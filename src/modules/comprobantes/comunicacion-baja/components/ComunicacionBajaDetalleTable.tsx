import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

import type { ComunicacionBajaDetalle } from "../types/comunicacionBaja.types"

export function ComunicacionBajaDetalleTable({ detalles = [] }: { detalles?: ComunicacionBajaDetalle[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos incluidos</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Serie</TableHead>
              <TableHead>Correlativo</TableHead>
              <TableHead>Numero</TableHead>
              <TableHead>Motivo baja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detalles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No hay documentos incluidos en esta comunicacion.
                </TableCell>
              </TableRow>
            ) : (
              detalles.map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell className="font-medium">{detalle.tipo_documento}</TableCell>
                  <TableCell>{detalle.serie ?? "-"}</TableCell>
                  <TableCell>{detalle.correlativo ?? "-"}</TableCell>
                  <TableCell>{detalle.numero_completo ?? detalle.numero_comprobante ?? "-"}</TableCell>
                  <TableCell className="max-w-md whitespace-normal">{detalle.motivo_baja ?? "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
