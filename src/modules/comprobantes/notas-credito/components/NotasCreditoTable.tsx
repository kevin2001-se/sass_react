import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { NotaCreditoActions } from "@/modules/comprobantes/notas-credito/components/NotaCreditoActions"
import { NotaCreditoEstadoBadge } from "@/modules/comprobantes/notas-credito/components/NotaCreditoEstadoBadge"
import { NotaCreditoSunatBadge } from "@/modules/comprobantes/notas-credito/components/NotaCreditoSunatBadge"
import type { NotaCredito } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { getNotaCreditoCliente, getNotaCreditoComprobanteRef, getNotaCreditoMotivo, getNotaCreditoNumero, numberValue } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

function formatDate(value?: string | null) { return value ? value.slice(0, 10) : "-" }
type Props = { notas: NotaCredito[]; isLoading?: boolean }

export function NotasCreditoTable({ notas, isLoading }: Props) {
  const columns: ColumnDef<NotaCredito>[] = [
    { header: "Fecha", cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.created_at)}</span> },
    { header: "Numero NC", cell: ({ row }) => <span className="font-medium">{getNotaCreditoNumero(row.original)}</span> },
    { header: "Comprobante", cell: ({ row }) => <span className="whitespace-nowrap">{getNotaCreditoComprobanteRef(row.original)}</span> },
    { header: "Cliente", cell: ({ row }) => <span className="line-clamp-2 min-w-40">{getNotaCreditoCliente(row.original)}</span> },
    { header: "Motivo", cell: ({ row }) => <span className="line-clamp-2 min-w-48">{getNotaCreditoMotivo(row.original)}</span> },
    { header: "Tipo", cell: ({ row }) => <span>{row.original.tipo_nota}</span> },
    { header: "Total", cell: ({ row }) => <span className="font-semibold">{formatCurrency(numberValue(row.original.total))}</span> },
    { header: "Estado", cell: ({ row }) => <NotaCreditoEstadoBadge estado={row.original.estado} /> },
    { header: "SUNAT", cell: ({ row }) => <NotaCreditoSunatBadge estado={row.original.estado_sunat} /> },
    { id: "acciones", header: "Acciones", cell: ({ row }) => <NotaCreditoActions nota={row.original} /> },
  ]
  const table = useReactTable({ data: notas, columns, getCoreRowModel: getCoreRowModel() })
  if (isLoading) return <TableSkeleton />
  if (notas.length === 0) return <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">No hay notas de credito registradas.</div>
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