import { Search } from "lucide-react"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useProveedores } from "@/modules/compras/proveedores/hooks/useProveedores"
import type { CompraFilters } from "@/modules/compras/compras/types/compra.types"

type CompraFiltersProps = { filters: CompraFilters; onChange: (filters: CompraFilters) => void }

export function CompraFilters({ filters, onChange }: CompraFiltersProps) {
  const proveedores = useProveedores({ estado: "1", per_page: 100 })
  const update = (patch: Partial<CompraFilters>) => onChange({ ...filters, ...patch, page: 1 })

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <div className="relative xl:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Numero documento" value={filters.numero_documento ?? ""} onChange={(event) => update({ numero_documento: event.target.value })} />
      </div>
      <Input type="date" value={filters.fecha_inicio ?? ""} onChange={(event) => update({ fecha_inicio: event.target.value })} />
      <Input type="date" value={filters.fecha_fin ?? ""} onChange={(event) => update({ fecha_fin: event.target.value })} />
      <AppCombobox value={filters.proveedor_id ?? null} onChange={(value) => update({ proveedor_id: value ? String(value) : undefined })} options={(proveedores.data?.data ?? []).map((p) => ({ value: p.id, label: p.razon_social, description: p.numero_documento }))} placeholder="Proveedor" loading={proveedores.isLoading} />
      <Select value={filters.tipo_documento ?? "TODOS"} onValueChange={(value) => update({ tipo_documento: value === "TODOS" ? undefined : value })}>
        <SelectTrigger><SelectValue placeholder="Tipo documento" /></SelectTrigger>
        <SelectContent><SelectItem value="TODOS">Todos</SelectItem><SelectItem value="FACTURA">Factura</SelectItem><SelectItem value="BOLETA">Boleta</SelectItem><SelectItem value="NOTA_COMPRA">Nota compra</SelectItem><SelectItem value="GUIA_PROVEEDOR">Guia proveedor</SelectItem></SelectContent>
      </Select>
      <Select value={filters.tipo_pago ?? "TODOS"} onValueChange={(value) => update({ tipo_pago: value === "TODOS" ? undefined : value })}>
        <SelectTrigger><SelectValue placeholder="Tipo pago" /></SelectTrigger>
        <SelectContent><SelectItem value="TODOS">Todos</SelectItem><SelectItem value="CONTADO">Contado</SelectItem><SelectItem value="CREDITO">Credito</SelectItem></SelectContent>
      </Select>
      <Select value={filters.estado ?? "TODOS"} onValueChange={(value) => update({ estado: value === "TODOS" ? undefined : value })}>
        <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
        <SelectContent><SelectItem value="TODOS">Todos</SelectItem><SelectItem value="REGISTRADA">Registrada</SelectItem><SelectItem value="ANULADA">Anulada</SelectItem></SelectContent>
      </Select>
      <Button type="button" variant="outline" onClick={() => onChange({ page: 1, per_page: filters.per_page ?? 15 })}>Limpiar</Button>
    </div>
  )
}
