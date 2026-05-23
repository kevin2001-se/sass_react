import { Search } from "lucide-react"

import type { Categoria, ProductoFilters as ProductoFiltersType } from "@/modules/productos/types/producto.types"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

type ProductoFiltersProps = {
  filters: ProductoFiltersType
  categorias: Categoria[]
  onChange: (filters: ProductoFiltersType) => void
}

export function ProductoFilters({ filters, categorias, onChange }: ProductoFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_220px_180px_auto]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por cÃ³digo o nombre"
          value={filters.buscar ?? ""}
          onChange={(event) => onChange({ ...filters, buscar: event.target.value, page: 1 })}
        />
      </div>

      <AppCombobox
        value={filters.categoria_id || null}
        onChange={(value) => onChange({ ...filters, categoria_id: value === null ? "" : String(value), page: 1 })}
        options={categorias.map((categoria) => ({ value: categoria.id, label: categoria.nombre }))}
        placeholder="Todas las categorías"
        searchPlaceholder="Buscar categoría..."
        emptyMessage="No se encontraron categorías"
      />

      <Select
        value={filters.estado || "all"}
        onValueChange={(value) => onChange({ ...filters, estado: value === "all" ? "" : value, page: 1 })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="1">Activos</SelectItem>
          <SelectItem value="0">Inactivos</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        onClick={() => onChange({ page: 1, per_page: filters.per_page ?? 15 })}
      >
        Limpiar
      </Button>
    </div>
  )
}

