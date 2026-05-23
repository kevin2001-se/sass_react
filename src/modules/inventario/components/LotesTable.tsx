import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, PowerOff } from "lucide-react"

import type { Lote } from "@/modules/inventario/types/inventario.types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

type LotesTableProps = {
  lotes: Lote[]
  isLoading?: boolean
  onEdit: (lote: Lote) => void
  onDelete: (lote: Lote) => void
  isDeleting?: boolean
}

export function LotesTable({ lotes, isLoading, onEdit, onDelete, isDeleting }: LotesTableProps) {
  const columns: ColumnDef<Lote>[] = [
    {
      header: "Lote",
      cell: ({ row }) => <span className="font-medium">{row.original.codigo_lote}</span>,
    },
    {
      header: "Producto",
      cell: ({ row }) => row.original.producto?.nombre ?? "-",
    },
    {
      header: "Vencimiento",
      cell: ({ row }) => row.original.fecha_vencimiento ?? "-",
    },
    {
      header: "Stock",
      cell: ({ row }) => Number(row.original.stock?.cantidad_actual ?? 0).toFixed(2),
    },
    {
      header: "Estado",
      cell: ({ row }) => <Badge variant={row.original.estado ? "secondary" : "outline"}>{row.original.estado ? "Activo" : "Inactivo"}</Badge>,
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive" onSelect={(event) => event.preventDefault()}>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Desactivar
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Desactivar lote</AlertDialogTitle>
              <AlertDialogDescription>El lote no se eliminará físicamente. Se marcará como inactivo.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction disabled={isDeleting} onClick={() => onDelete(row.original)}>
                Desactivar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ]
  const table = useReactTable({ data: lotes, columns, getCoreRowModel: getCoreRowModel() })

  if (isLoading) return <TableSkeleton />
  if (!lotes.length) return <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">No hay lotes registrados.</div>

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
