import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { tipoDocumentoProveedorOptions, type ProveedorFilters } from "@/modules/compras/proveedores/types/proveedor.types"

type Props = { filters: ProveedorFilters; onChange: (filters: ProveedorFilters) => void }

export function ProveedorFilters({ filters, onChange }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px_190px]">
      <Input placeholder="Buscar por documento, razón social, contacto..." value={filters.search ?? ""} onChange={(event) => onChange({ ...filters, search: event.target.value, page: 1 })} />
      <Select value={filters.estado ?? "all"} onValueChange={(value) => onChange({ ...filters, estado: value === "all" ? undefined : value, page: 1 })}>
        <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
        <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="true">Activos</SelectItem><SelectItem value="false">Inactivos</SelectItem></SelectContent>
      </Select>
      <Select value={filters.tipo_documento ?? "all"} onValueChange={(value) => onChange({ ...filters, tipo_documento: value === "all" ? undefined : value, page: 1 })}>
        <SelectTrigger><SelectValue placeholder="Tipo documento" /></SelectTrigger>
        <SelectContent><SelectItem value="all">Todos</SelectItem>{tipoDocumentoProveedorOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  )
}