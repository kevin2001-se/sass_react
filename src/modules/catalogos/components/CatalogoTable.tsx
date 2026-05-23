import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, PowerOff } from "lucide-react"

import { CatalogoStatusBadge } from "@/modules/catalogos/components/CatalogoStatusBadge"
import type { CatalogoConfig, CatalogoItem } from "@/modules/catalogos/types/catalogo.types"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { useAuthStore } from "@/shared/stores/auth.store"

type CatalogoTableProps = {
  config: CatalogoConfig
  items: CatalogoItem[]
  loading?: boolean
  onEdit: (item: CatalogoItem) => void
  onDelete: (item: CatalogoItem) => void
}

export function CatalogoTable({ config, items, loading, onEdit, onDelete }: CatalogoTableProps) {
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const canEdit = hasPermission(config.permisos.editar)
  const canDelete = hasPermission(config.permisos.eliminar)

  const columns: ColumnDef<CatalogoItem>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.nombre}</p>
          <p className="text-xs text-muted-foreground">{row.original.descripcion ?? "Sin descripción"}</p>
        </div>
      ),
    },
    ...(config.isUnidadMedida ? [
      {
        header: "Código",
        cell: ({ row }) => row.original.codigo ?? row.original.abreviatura ?? "-",
      } satisfies ColumnDef<CatalogoItem>,
      {
        header: "Símbolo",
        cell: ({ row }) => row.original.simbolo ?? row.original.abreviatura ?? "-",
      } satisfies ColumnDef<CatalogoItem>,
    ] : []),
    {
      header: "Estado",
      cell: ({ row }) => <CatalogoStatusBadge estado={row.original.estado} />,
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled={!canEdit} onClick={() => onEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!canDelete} className="text-destructive" onClick={() => onDelete(row.original)}>
              <PowerOff className="mr-2 h-4 w-4" />
              Desactivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return (
      <div className="space-y-3 rounded-md border p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton className="h-10 w-full" key={index} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        No se encontraron registros.
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
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
