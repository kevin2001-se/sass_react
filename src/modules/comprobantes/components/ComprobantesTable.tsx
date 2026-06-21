import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import { ComprobanteActions } from "@/modules/comprobantes/components/ComprobanteActions"
import { ComprobanteBajaBadge } from "@/modules/comprobantes/components/ComprobanteBajaBadge"
import { ComprobanteDocumentActions } from "@/modules/comprobantes/components/ComprobanteDocumentActions"
import { ComprobanteEstadoSunatBadge } from "@/modules/comprobantes/components/ComprobanteEstadoSunatBadge"
import type { ComprobanteElectronico } from "@/modules/comprobantes/types/comprobante.types"
import { getComprobanteClienteNombre, getComprobanteNotasCreditoCount, getComprobanteNotasDebitoCount, getComprobanteTotal } from "@/modules/comprobantes/types/comprobante.types"
import { Badge } from "@/shared/components/ui/badge"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { formatCurrency, formatDateTime } from "@/modules/caja/components/cajaFormatters"

type Props = {
  comprobantes: ComprobanteElectronico[]
  isLoading?: boolean
  onNotaCredito?: (comprobante: ComprobanteElectronico) => void
  onNotaDebito?: (comprobante: ComprobanteElectronico) => void
}

export function ComprobantesTable({ comprobantes, isLoading, onNotaCredito, onNotaDebito }: Props) {
  const columns: ColumnDef<ComprobanteElectronico>[] = [
    { header: "Fecha", cell: ({ row }) => <span className="whitespace-nowrap text-sm">{formatDateTime(row.original.fecha_emision)}</span> },
    { header: "Tipo", cell: ({ row }) => <div className="flex flex-wrap gap-1"><Badge variant="outline">{row.original.tipo_comprobante.replaceAll("_", " ")}</Badge>{getComprobanteNotasCreditoCount(row.original) > 0 ? <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">Con NC {getComprobanteNotasCreditoCount(row.original)}</Badge> : null}{getComprobanteNotasDebitoCount(row.original) > 0 ? <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">Con ND {getComprobanteNotasDebitoCount(row.original)}</Badge> : null}</div> },
    { header: "Numero", cell: ({ row }) => <span className="font-medium">{row.original.numero_comprobante}</span> },
    { header: "Cliente", cell: ({ row }) => getComprobanteClienteNombre(row.original) },
    { header: "Total", cell: ({ row }) => <span className="font-semibold">{formatCurrency(getComprobanteTotal(row.original))}</span> },
    { header: "SUNAT", cell: ({ row }) => <div className="flex flex-wrap gap-1"><ComprobanteEstadoSunatBadge estado={row.original.estado_sunat} /><ComprobanteBajaBadge estado={row.original.estado_baja} /></div> },
    { header: "Codigo", cell: ({ row }) => row.original.codigo_respuesta ?? "-" },
    { header: "Mensaje", cell: ({ row }) => <span className="line-clamp-2 max-w-[220px] text-xs text-muted-foreground">{row.original.mensaje_respuesta ?? "-"}</span> },
    { header: "Intentos", cell: ({ row }) => row.original.intentos_envio ?? 0 },
    { id: "docs", header: "Documentos", cell: ({ row }) => <ComprobanteDocumentActions comprobante={row.original} compact /> },
    { id: "acciones", header: "", cell: ({ row }) => <ComprobanteActions comprobante={row.original} onNotaCredito={onNotaCredito} onNotaDebito={onNotaDebito} /> },
  ]

  const table = useReactTable({ data: comprobantes, columns, getCoreRowModel: getCoreRowModel() })

  if (isLoading) return <TableSkeleton />
  if (comprobantes.length === 0) return <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">No hay comprobantes para mostrar.</div>

  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => <TableRow key={group.id}>{group.headers.map((header) => <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>)}</TableRow>)}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => <TableRow key={row.id}>{row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>)}
        </TableBody>
      </Table>
    </div>
  )
}

function TableSkeleton() {
  return <div className="space-y-3 rounded-md border bg-background p-4">{Array.from({ length: 8 }).map((_, index) => <Skeleton className="h-12 w-full" key={index} />)}</div>
}



