import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { FileArchive, FileText, Ticket } from "lucide-react"

import { GuiaRemisionActions } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionActions"
import { GuiaRemisionEstadoBadge } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionEstadoBadge"
import { GuiaRemisionSunatBadge } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionSunatBadge"
import type { GuiaRemision } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { getGuiaModalidad, getGuiaMotivo, getGuiaNumero } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { Badge } from "@/shared/components/ui/badge"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

function formatDate(value?: string | null) {
  if (!value) return "-"
  return value.slice(0, 10)
}

function DocBadge({ active, label, icon: Icon }: { active?: boolean; label: string; icon: typeof FileText }) {
  return (
    <Badge variant="outline" className={active ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "text-muted-foreground"}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  )
}

type Props = {
  guias: GuiaRemision[]
  isLoading?: boolean
}

export function GuiasRemisionTable({ guias, isLoading }: Props) {
  const columns: ColumnDef<GuiaRemision>[] = [
    { header: "F. emision", cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.fecha_emision)}</span> },
    { header: "F. traslado", cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.fecha_traslado)}</span> },
    { header: "Numero", cell: ({ row }) => <span className="font-medium">{getGuiaNumero(row.original)}</span> },
    { header: "Destinatario", cell: ({ row }) => <span className="line-clamp-2 min-w-40">{row.original.destinatario_nombre || "-"}</span> },
    { header: "Motivo", cell: ({ row }) => <span>{getGuiaMotivo(row.original)}</span> },
    { header: "Modalidad", cell: ({ row }) => <span>{getGuiaModalidad(row.original)}</span> },
    { header: "Estado", cell: ({ row }) => <GuiaRemisionEstadoBadge estado={row.original.estado} /> },
    { header: "SUNAT", cell: ({ row }) => <GuiaRemisionSunatBadge estado={row.original.estado_sunat} /> },
    {
      header: "Documentos",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <DocBadge active={row.original.tiene_xml} label="XML" icon={FileArchive} />
          <DocBadge active={row.original.tiene_cdr} label="CDR" icon={FileArchive} />
          <DocBadge active={row.original.tiene_pdf_a4} label="PDF" icon={FileText} />
          <DocBadge active={row.original.tiene_ticket_80} label="Ticket" icon={Ticket} />
        </div>
      ),
    },
    { id: "acciones", header: "Acciones", cell: ({ row }) => <GuiaRemisionActions guia={row.original} /> },
  ]

  const table = useReactTable({ data: guias, columns, getCoreRowModel: getCoreRowModel() })

  if (isLoading) return <TableSkeleton />

  if (guias.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
        No hay guias de remision registradas.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border bg-background">
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
