import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { NotaDebitoActions } from "@/modules/comprobantes/notas-debito/components/NotaDebitoActions"
import { NotaDebitoEstadoBadge } from "@/modules/comprobantes/notas-debito/components/NotaDebitoEstadoBadge"
import { NotaDebitoSunatBadge } from "@/modules/comprobantes/notas-debito/components/NotaDebitoSunatBadge"
import type { NotaDebito } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { getNotaDebitoCliente, getNotaDebitoComprobanteRef, getNotaDebitoMotivo, getNotaDebitoNumero, numberValue } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

function formatDate(value?: string | null) { return value ? value.slice(0, 10) : "-" }
type Props = { notas: NotaDebito[]; isLoading?: boolean }

export function NotasDebitoTable({ notas, isLoading }: Props) {
  const columns: ColumnDef<NotaDebito>[] = [
    { header: "Fecha", cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.created_at)}</span> },
    { header: "Numero ND", cell: ({ row }) => <span className="font-medium">{getNotaDebitoNumero(row.original)}</span> },
    { header: "Comprobante", cell: ({ row }) => <span className="whitespace-nowrap">{getNotaDebitoComprobanteRef(row.original)}</span> },
    { header: "Cliente", cell: ({ row }) => <span className="line-clamp-2 min-w-40">{getNotaDebitoCliente(row.original)}</span> },
    { header: "Motivo", cell: ({ row }) => <span className="line-clamp-2 min-w-48">{getNotaDebitoMotivo(row.original)}</span> },
    { header: "Total", cell: ({ row }) => <span className="font-semibold">{formatCurrency(numberValue(row.original.total))}</span> },
    { header: "Estado", cell: ({ row }) => <NotaDebitoEstadoBadge estado={row.original.estado} /> },
    { header: "SUNAT", cell: ({ row }) => <NotaDebitoSunatBadge estado={row.original.estado_sunat} /> },
    { id: "acciones", header: "Acciones", cell: ({ row }) => <NotaDebitoActions nota={row.original} /> },
  ]
  const table = useReactTable({ data: notas, columns, getCoreRowModel: getCoreRowModel() })
  if (isLoading) return <TableSkeleton />
  if (notas.length === 0) return <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">No hay notas de debito registradas.</div>
  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <Table>
        <TableHeader>{table.getHeaderGroups().map((headerGroup) => <TableRow key={headerGroup.id}>{headerGroup.headers.map((header) => <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>)}</TableRow>)}</TableHeader>
        <TableBody>{table.getRowModel().rows.map((row) => <TableRow key={row.id}>{row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>)}</TableBody>
      </Table>
    </div>
  )
}

function TableSkeleton() { return <div className="space-y-3 rounded-md border bg-background p-4">{Array.from({ length: 8 }).map((_, index) => <Skeleton className="h-12 w-full" key={index} />)}</div> }