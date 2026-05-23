import { FileText, MapPin, Package, User } from "lucide-react"

import type { GuiaVentaData } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

function customerName(data?: GuiaVentaData) {
  return data?.cliente?.razon_social || data?.cliente?.nombres || data?.cliente?.nombre || "Clientes varios"
}

function comprobanteNumero(data?: GuiaVentaData) {
  return data?.comprobante?.numero || data?.comprobante?.numero_comprobante || "-"
}

function productos(data?: GuiaVentaData) {
  return data?.productos ?? data?.detalles ?? []
}

export function GuiaVentaPreview({ data, loading }: { data?: GuiaVentaData; loading?: boolean }) {
  if (loading) return <Skeleton className="h-72 w-full" />
  if (!data) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos sugeridos de la venta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Info icon={User} label="Cliente" value={`${customerName(data)} · ${data.cliente?.numero_documento ?? "Sin documento"}`} />
          <Info icon={FileText} label="Comprobante" value={`${data.comprobante?.tipo ?? data.comprobante?.tipo_comprobante ?? "Venta"} ${comprobanteNumero(data)}`} />
          <Info icon={MapPin} label="Punto partida" value={`${data.punto_partida?.ubigeo ?? data.tienda?.ubigeo ?? "-"} · ${data.punto_partida?.direccion ?? data.tienda?.direccion ?? "-"}`} />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Presentacion</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos(data).length === 0 ? (
                <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">La venta no tiene productos para mostrar.</TableCell></TableRow>
              ) : productos(data).map((item, index) => (
                <TableRow key={item.id ?? index}>
                  <TableCell className="font-medium">{item.producto?.nombre || item.descripcion || "Producto"}</TableCell>
                  <TableCell>{item.presentacion?.nombre || item.unidad_medida || "-"}</TableCell>
                  <TableCell className="text-right">{item.cantidad_presentacion ?? item.cantidad ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function Info({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground"><Icon className="h-4 w-4" />{label}</div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}
