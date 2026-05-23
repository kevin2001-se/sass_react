import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { Eye, MoreHorizontal, Pencil, PowerOff } from "lucide-react"
import { Link } from "react-router-dom"

import { ProductoStatusBadge } from "@/modules/productos/components/ProductoStatusBadge"
import type { Producto } from "@/modules/productos/types/producto.types"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Skeleton } from "@/shared/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"

type ProductosTableProps = {
  productos: Producto[]
  isLoading?: boolean
  onDelete: (producto: Producto) => void
  isDeleting?: boolean
}

export function ProductosTable({ productos, isLoading, onDelete, isDeleting }: ProductosTableProps) {
  const columns: ColumnDef<Producto>[] = [
    {
      accessorKey: "codigo_interno",
      header: "Codigo",
      cell: ({ row }) => <span className="font-medium">{row.original.codigo_interno}</span>,
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.nombre}</p>
          <p className="text-xs text-muted-foreground">{row.original.concentracion ?? "Sin concentracion"}</p>
        </div>
      ),
    },
    {
      header: "Categoria",
      cell: ({ row }) => row.original.categoria?.nombre ?? "-",
    },
    {
      header: "Receta",
      cell: ({ row }) => <BooleanBadge value={row.original.requiere_receta} />,
    },
    {
      header: "Lote",
      cell: ({ row }) => <BooleanBadge value={row.original.maneja_lote} />,
    },
    {
      header: "Afectacion",
      cell: ({ row }) => <Badge variant="secondary">{row.original.afectacion_igv?.abreviatura ?? (row.original.afecto_igv ? "IGV" : "EXO")}</Badge>,
    },
    {
      header: "Estado",
      cell: ({ row }) => <ProductoStatusBadge estado={row.original.estado} />,
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
              <DropdownMenuItem asChild>
                <Link to={`/productos/${row.original.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/productos/${row.original.id}/editar`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Link>
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
              <AlertDialogTitle>Desactivar producto</AlertDialogTitle>
              <AlertDialogDescription>
                El producto no se eliminara fisicamente. Se marcara como inactivo junto a sus presentaciones.
              </AlertDialogDescription>
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

  const table = useReactTable({
    data: productos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <TableSkeleton />
  }

  if (productos.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        No se encontraron productos con los filtros actuales.
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

function BooleanBadge({ value }: { value: boolean }) {
  return <Badge variant={value ? "secondary" : "outline"}>{value ? "Si" : "No"}</Badge>
}

function TableSkeleton() {
  return (
    <div className="space-y-3 rounded-md border bg-background p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton className="h-10 w-full" key={index} />
      ))}
    </div>
  )
}



