import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import type { InventarioMovimiento } from "@/modules/inventario/types/inventario.types"
import { Badge } from "@/shared/components/ui/badge"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

type KardexTableProps = {
  movimientos: InventarioMovimiento[]
  isLoading?: boolean
}

export function KardexTable({ movimientos, isLoading }: KardexTableProps) {
  const columns: ColumnDef<InventarioMovimiento>[] = [
    { header: "Fecha", cell: ({ row }) => row.original.created_at ?? "-" },
    { header: "Tipo", cell: ({ row }) => <Badge variant="outline">{row.original.tipo_movimiento}</Badge> },
    { header: "Motivo", cell: ({ row }) => row.original.motivo },
    { header: "Presentación", cell: ({ row }) => row.original.presentacion?.nombre ?? "-" },
    { header: "Cantidad base", cell: ({ row }) => Number(row.original.cantidad_base).toFixed(2) },
    { header: "Stock anterior", cell: ({ row }) => Number(row.original.stock_anterior).toFixed(2) },
    { header: "Stock nuevo", cell: ({ row }) => Number(row.original.stock_nuevo).toFixed(2) },
    { header: "Usuario", cell: ({ row }) => row.original.user?.name ?? "-" },
    { header: "Referencia", cell: ({ row }) => row.original.referencia_tipo ? `${row.original.referencia_tipo} #${row.original.referencia_id ?? ""}` : "-" },
  ]
  const table = useReactTable({ data: movimientos, columns, getCoreRowModel: getCoreRowModel() })

  if (isLoading) return <TableSkeleton />
  if (!movimientos.length) return <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">No hay movimientos para mostrar.</div>

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

function TableSkeleton() {
  return (
    <div className="space-y-3 rounded-md border bg-background p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton className="h-10 w-full" key={index} />
      ))}
    </div>
  )
}
