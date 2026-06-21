import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

import { ResumenDiarioActions } from "./ResumenDiarioActions"
import { ResumenDiarioEstadoBadge } from "./ResumenDiarioEstadoBadge"
import { ResumenDiarioSunatBadge } from "./ResumenDiarioSunatBadge"
import type { ResumenDiario } from "../types/resumenDiario.types"
import { toNumber } from "../types/resumenDiario.types"

const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" })

const columns: ColumnDef<ResumenDiario>[] = [
  { accessorKey: "fecha_resumen", header: "Fecha resumen" },
  { accessorKey: "identificador", header: "Identificador", cell: ({ row }) => <span className="font-semibold">{row.original.identificador}</span> },
  { accessorKey: "total_documentos", header: "Docs", cell: ({ row }) => toNumber(row.original.total_documentos) },
  { accessorKey: "total_boletas", header: "Boletas", cell: ({ row }) => toNumber(row.original.total_boletas) },
  { accessorKey: "total_notas_credito", header: "NC", cell: ({ row }) => toNumber(row.original.total_notas_credito) },
  { accessorKey: "total_notas_debito", header: "ND", cell: ({ row }) => toNumber(row.original.total_notas_debito) },
  { accessorKey: "monto_total", header: () => <div className="text-right">Monto total</div>, cell: ({ row }) => <div className="text-right font-semibold">{currency.format(toNumber(row.original.monto_total))}</div> },
  { accessorKey: "estado", header: "Estado", cell: ({ row }) => <ResumenDiarioEstadoBadge estado={row.original.estado} /> },
  { accessorKey: "estado_sunat", header: "SUNAT", cell: ({ row }) => <ResumenDiarioSunatBadge estado={row.original.estado_sunat} /> },
  { accessorKey: "ticket_sunat", header: "Ticket", cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.ticket_sunat ?? row.original.ticket ?? "-"}</span> },
  { id: "actions", header: "Acciones", cell: ({ row }) => <ResumenDiarioActions resumen={row.original} /> },
]

export function ResumenDiarioTable({ data }: { data: ResumenDiario[] }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                  No hay resumenes diarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}