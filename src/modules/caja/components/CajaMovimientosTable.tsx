import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import { formatCurrency, formatDateTime, formatMetodoPago, formatTipoMovimiento } from "@/modules/caja/components/cajaFormatters"
import type { CajaMovimiento } from "@/modules/caja/types/caja.types"
import { Badge } from "@/shared/components/ui/badge"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

type CajaMovimientosTableProps = {
  movimientos: CajaMovimiento[]
  isLoading?: boolean
}

export function CajaMovimientosTable({ movimientos, isLoading }: CajaMovimientosTableProps) {
  const columns: ColumnDef<CajaMovimiento>[] = [
    { header: "Fecha", cell: ({ row }) => formatDateTime(row.original.created_at) },
    { header: "Tipo", cell: ({ row }) => <Badge variant="outline">{formatTipoMovimiento(row.original.tipo_movimiento)}</Badge> },
    { header: "Método", cell: ({ row }) => formatMetodoPago(row.original.metodo_pago) },
    { header: "Concepto", cell: ({ row }) => row.original.concepto },
    { header: "Monto", cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.original.monto)}</span> },
    { header: "Usuario", cell: ({ row }) => row.original.user?.name ?? "-" },
    { header: "Referencia", cell: ({ row }) => row.original.referencia_tipo ? `${row.original.referencia_tipo} #${row.original.referencia_id ?? ""}` : "-" },
    { header: "Observación", cell: ({ row }) => row.original.observacion ?? "-" },
  ]
  const table = useReactTable({ data: movimientos, columns, getCoreRowModel: getCoreRowModel() })

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-md border bg-background p-4">
        {Array.from({ length: 8 }).map((_, index) => <Skeleton className="h-10 w-full" key={index} />)}
      </div>
    )
  }

  if (!movimientos.length) {
    return <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">No hay movimientos de caja.</div>
  }

  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
