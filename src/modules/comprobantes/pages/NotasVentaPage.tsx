import { Eye, Printer } from "lucide-react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

export function NotasVentaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="secondary">Comprobantes internos</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-normal text-foreground">Notas de venta</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Consulta e impresion de notas de venta internas emitidas desde el POS.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busca por fecha, numero o cliente.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Input type="date" aria-label="Fecha inicio" />
          <Input placeholder="Numero de comprobante" />
          <Input placeholder="Cliente" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
          <CardDescription>La conexion real al endpoint se completara en el modulo de comprobantes internos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Numero</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                    No hay notas de venta cargadas todavia.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button disabled variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Ver detalle
            </Button>
            <Button disabled variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
