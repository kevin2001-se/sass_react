import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Edit, MoreHorizontal, PowerOff } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { ProveedorStatusBadge } from "@/modules/compras/proveedores/components/ProveedorStatusBadge"
import type { Proveedor } from "@/modules/compras/proveedores/types/proveedor.types"

const columnHelper = createColumnHelper<Proveedor>()

type Props = { proveedores: Proveedor[]; onEdit: (proveedor: Proveedor) => void; onDelete: (proveedor: Proveedor) => void }

export function ProveedoresTable({ proveedores, onEdit, onDelete }: Props) {
  const columns = [
    columnHelper.accessor("tipo_documento", { header: "Tipo" }),
    columnHelper.accessor("numero_documento", { header: "Número" }),
    columnHelper.accessor("razon_social", { header: "Razón social", cell: (info) => <span className="font-medium">{info.getValue()}</span> }),
    columnHelper.accessor("nombre_comercial", { header: "Nombre comercial", cell: (info) => info.getValue() || "-" }),
    columnHelper.accessor("telefono", { header: "Teléfono", cell: (info) => info.getValue() || "-" }),
    columnHelper.accessor("email", { header: "Email", cell: (info) => info.getValue() || "-" }),
    columnHelper.accessor("contacto", { header: "Contacto", cell: (info) => info.getValue() || "-" }),
    columnHelper.accessor("estado", { header: "Estado", cell: (info) => <ProveedorStatusBadge estado={info.getValue()} /> }),
    columnHelper.display({ id: "actions", header: "Acciones", cell: ({ row }) => <div className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label="Acciones proveedor"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => onEdit(row.original)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>{row.original.estado ? <DropdownMenuItem onClick={() => onDelete(row.original)}><PowerOff className="mr-2 h-4 w-4" />Desactivar</DropdownMenuItem> : null}</DropdownMenuContent></DropdownMenu></div> }),
  ]

  const table = useReactTable({ data: proveedores, columns, getCoreRowModel: getCoreRowModel() })

  return <Table><TableHeader>{table.getHeaderGroups().map((group) => <TableRow key={group.id}>{group.headers.map((header) => <TableHead key={header.id} className={header.column.id === "actions" ? "text-right" : undefined}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>)}</TableRow>)}</TableHeader><TableBody>{table.getRowModel().rows.map((row) => <TableRow key={row.id}>{row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>)}</TableBody></Table>
}