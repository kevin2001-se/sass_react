import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import { StockStatusBadge } from "@/modules/inventario/components/StockStatusBadge"
import type { Stock } from "@/modules/inventario/types/inventario.types"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

type StockTableProps = {
  stocks: Stock[]
  isLoading?: boolean
}

export function StockTable({ stocks, isLoading }: StockTableProps) {
  const columns: ColumnDef<Stock>[] = [
    {
      header: "Producto",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.producto?.nombre ?? "-"}</p>
          <p className="text-xs text-muted-foreground">{row.original.producto?.codigo_interno ?? ""}</p>
        </div>
      ),
    },
    {
      header: "Presentación principal",
      cell: ({ row }) => row.original.producto?.presentacion_principal?.nombre ?? "-",
    },
    {
      header: "Lote",
      cell: ({ row }) => row.original.lote?.codigo_lote ?? "Sin lote",
    },
    {
      header: "Vencimiento",
      cell: ({ row }) => row.original.lote?.fecha_vencimiento ?? "-",
    },
    {
      header: "Actual",
      cell: ({ row }) => <span className="font-semibold">{Number(row.original.cantidad_actual).toFixed(2)}</span>,
    },
    {
      header: "Mínima",
      cell: ({ row }) => row.original.cantidad_minima ?? "-",
    },
    {
      header: "Estado stock",
      cell: ({ row }) => <StockStatusBadge stock={row.original} />,
    },
  ]

  const table = useReactTable({ data: stocks, columns, getCoreRowModel: getCoreRowModel() })

  if (isLoading) return <TableSkeleton />

  if (!stocks.length) {
    return <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">No hay stock para los filtros actuales.</div>
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

function TableSkeleton() {
  return (
    <div className="space-y-3 rounded-md border bg-background p-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton className="h-10 w-full" key={index} />
      ))}
    </div>
  )
}
