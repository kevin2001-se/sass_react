import { Search } from "lucide-react"

import type { CatalogoFilters as CatalogoFiltersType } from "@/modules/catalogos/types/catalogo.types"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

type CatalogoFiltersProps = {
  filters: CatalogoFiltersType
  onChange: (filters: CatalogoFiltersType) => void
}

export function CatalogoFilters({ filters, onChange }: CatalogoFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por nombre"
          value={filters.buscar ?? ""}
          onChange={(event) => onChange({ ...filters, buscar: event.target.value, page: 1 })}
        />
      </div>
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
      <Button variant="outline" onClick={() => onChange({ page: 1, per_page: filters.per_page ?? 15 })}>
        Limpiar
      </Button>
    </div>
  )
}
