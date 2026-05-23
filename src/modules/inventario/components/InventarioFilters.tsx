import { Search } from "lucide-react"

import type { Categoria, Producto } from "@/modules/productos/types/producto.types"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

type InventarioFiltersProps = {
  buscar?: string
  estado?: string
  productoId?: string
  categoriaId?: string
  bajoStock?: string
  productos?: Producto[]
  categorias?: Categoria[]
  showProducto?: boolean
  showCategoria?: boolean
  showBajoStock?: boolean
  onBuscarChange?: (value: string) => void
  onEstadoChange?: (value: string) => void
  onProductoChange?: (value: string) => void
  onCategoriaChange?: (value: string) => void
  onBajoStockChange?: (value: string) => void
}

export function InventarioFilters({
  buscar,
  estado,
  productoId,
  categoriaId,
  bajoStock,
  productos = [],
  categorias = [],
  showProducto,
  showCategoria,
  showBajoStock,
  onBuscarChange,
  onEstadoChange,
  onProductoChange,
  onCategoriaChange,
  onBajoStockChange,
}: InventarioFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {onBuscarChange && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar..." value={buscar ?? ""} onChange={(event) => onBuscarChange(event.target.value)} />
        </div>
      )}

      {showProducto && (
        <AppCombobox
          value={productoId || null}
          onChange={(value) => onProductoChange?.(value === null ? "" : String(value))}
          options={productos.map((producto) => ({ value: producto.id, label: producto.nombre, description: producto.codigo_interno }))}
          placeholder="Todos los productos"
          searchPlaceholder="Buscar producto..."
          emptyMessage="No se encontraron productos"
        />
      )}

      {showCategoria && (
        <AppCombobox
          value={categoriaId || null}
          onChange={(value) => onCategoriaChange?.(value === null ? "" : String(value))}
          options={categorias.map((categoria) => ({ value: categoria.id, label: categoria.nombre }))}
          placeholder="Todas las categorías"
          searchPlaceholder="Buscar categoría..."
          emptyMessage="No se encontraron categorías"
        />
      )}

      {onEstadoChange && (
        <Select value={estado || "todos"} onValueChange={(value) => onEstadoChange(value === "todos" ? "" : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="true">Activo</SelectItem>
            <SelectItem value="false">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      )}

      {showBajoStock && (
        <Select value={bajoStock || "todos"} onValueChange={(value) => onBajoStockChange?.(value === "todos" ? "" : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todo el stock</SelectItem>
            <SelectItem value="true">Solo bajo stock</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

