import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { CompraDetalle } from "@/modules/compras/compras/types/compra.types"

function money(value: number | string) { return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(value ?? 0)) }

export function CompraDetalleItemsTable({ detalles }: { detalles: CompraDetalle[] }) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>Presentacion</TableHead><TableHead>Lote</TableHead><TableHead>Venc.</TableHead><TableHead className="text-right">Cant.</TableHead><TableHead className="text-right">Costo</TableHead><TableHead className="text-right">Desc.</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
        <TableBody>
          {detalles.map((item) => <TableRow key={item.id}><TableCell>{item.producto?.nombre ?? item.descripcion}</TableCell><TableCell>{item.presentacion?.nombre ?? "-"}</TableCell><TableCell>{item.lote?.codigo_lote ?? "-"}</TableCell><TableCell>{item.fecha_vencimiento ?? item.lote?.fecha_vencimiento ?? "-"}</TableCell><TableCell className="text-right">{Number(item.cantidad_presentacion).toFixed(2)}</TableCell><TableCell className="text-right">{money(item.costo_unitario ?? item.precio_unitario)}</TableCell><TableCell className="text-right">{money(item.descuento)}</TableCell><TableCell className="text-right font-semibold">{money(item.total)}</TableCell></TableRow>)}
        </TableBody>
      </Table>
    </div>
  )
}

