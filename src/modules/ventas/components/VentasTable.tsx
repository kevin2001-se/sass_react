import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import { VentaEstadoBadge } from "@/modules/ventas/components/VentaEstadoBadge"
import { VentaQuickActions } from "@/modules/ventas/components/VentaQuickActions"
import type { Venta } from "@/modules/ventas/types/venta.types"
import { getVentaClienteNombre, getVentaNotasCreditoCount, getVentaNotasDebitoCount } from "@/modules/ventas/types/venta.types"
import { Badge } from "@/shared/components/ui/badge"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { formatCurrency, formatDateTime, formatMetodoPago } from "@/modules/caja/components/cajaFormatters"

type VentasTableProps = {
  ventas: Venta[]
  isLoading?: boolean
}

export function VentasTable({ ventas, isLoading }: VentasTableProps) {
  const columns: ColumnDef<Venta>[] = [
    {
      header: "Fecha",
      cell: ({ row }) => <span className="whitespace-nowrap text-sm">{formatDateTime(row.original.fecha_emision)}</span>,
    },
    {
      header: "Comprobante",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.numero_comprobante}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            <Badge variant="outline">{row.original.tipo_comprobante.replaceAll("_", " ")}</Badge>
            {getVentaNotasCreditoCount(row.original) > 0 ? <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">Con NC {getVentaNotasCreditoCount(row.original)}</Badge> : null}
            {getVentaNotasDebitoCount(row.original) > 0 ? <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">Con ND {getVentaNotasDebitoCount(row.original)}</Badge> : null}
          </div>
        </div>
      ),
    },
    {
      header: "Cliente",
      cell: ({ row }) => <span>{getVentaClienteNombre(row.original.cliente)}</span>,
    },
    {
      header: "Usuario",
      cell: ({ row }) => row.original.usuario?.name ?? row.original.user?.name ?? "-",
    },
    {
      header: "Pago",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.original.metodos_pago ?? row.original.pagos?.map((pago) => pago.metodo_pago) ?? []).length > 0 ? (
            (row.original.metodos_pago ?? row.original.pagos?.map((pago) => pago.metodo_pago) ?? []).map((metodo) => (
              <Badge key={metodo} variant="secondary">{formatMetodoPago(metodo)}</Badge>
            ))
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      header: "Total",
      cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.original.total)}</span>,
    },
    {
      header: "Estado",
      cell: ({ row }) => <VentaEstadoBadge estado={row.original.estado} />,
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => <VentaQuickActions venta={row.original} compact />,
    },
  ]

  const table = useReactTable({ data: ventas, columns, getCoreRowModel: getCoreRowModel() })

  if (isLoading) return <TableSkeleton />

  if (ventas.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
        No hay ventas registradas.
      </div>
    )
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
      {Array.from({ length: 8 }).map((_, index) => <Skeleton className="h-12 w-full" key={index} />)}
    </div>
  )
}

