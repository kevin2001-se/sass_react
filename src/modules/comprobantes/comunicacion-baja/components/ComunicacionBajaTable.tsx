import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

import { ComunicacionBajaActions } from "./ComunicacionBajaActions"
import { ComunicacionBajaEstadoBadge } from "./ComunicacionBajaEstadoBadge"
import { ComunicacionBajaSunatBadge } from "./ComunicacionBajaSunatBadge"
import type { ComunicacionBaja } from "../types/comunicacionBaja.types"
import { toNumber } from "../types/comunicacionBaja.types"

const columns: ColumnDef<ComunicacionBaja>[] = [
  { accessorKey: "fecha_baja", header: "Fecha baja" },
  { accessorKey: "identificador", header: "Identificador", cell: ({ row }) => <span className="font-semibold">{row.original.identificador}</span> },
  { accessorKey: "total_documentos", header: "Docs", cell: ({ row }) => toNumber(row.original.total_documentos) },
  { accessorKey: "estado", header: "Estado", cell: ({ row }) => <ComunicacionBajaEstadoBadge estado={row.original.estado} /> },
  { accessorKey: "estado_sunat", header: "SUNAT", cell: ({ row }) => <ComunicacionBajaSunatBadge estado={row.original.estado_sunat} /> },
  { accessorKey: "ticket_sunat", header: "Ticket", cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.ticket_sunat ?? "-"}</span> },
  { id: "actions", header: "Acciones", cell: ({ row }) => <ComunicacionBajaActions comunicacion={row.original} /> },
]

export function ComunicacionBajaTable({ data }: { data: ComunicacionBaja[] }) {
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
                  No hay comunicaciones de baja registradas.
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
