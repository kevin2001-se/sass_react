import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { InventarioMovimiento } from "@/modules/inventario/types/inventario.types"

export function CompraMovimientosTable({ movimientos }: { movimientos: InventarioMovimiento[] }) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Producto</TableHead><TableHead>Tipo</TableHead><TableHead>Lote</TableHead><TableHead className="text-right">Cantidad</TableHead><TableHead className="text-right">Stock nuevo</TableHead></TableRow></TableHeader>
        <TableBody>{movimientos.map((m) => <TableRow key={m.id}><TableCell>{m.created_at ?? "-"}</TableCell><TableCell>{m.producto?.nombre ?? "-"}</TableCell><TableCell>{m.tipo_movimiento}</TableCell><TableCell>{m.lote?.codigo_lote ?? "-"}</TableCell><TableCell className="text-right">{Number(m.cantidad_presentacion).toFixed(2)}</TableCell><TableCell className="text-right">{Number(m.stock_nuevo).toFixed(2)}</TableCell></TableRow>)}</TableBody>
      </Table>
    </div>
  )
}
