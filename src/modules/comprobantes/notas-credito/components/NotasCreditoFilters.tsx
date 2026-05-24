import { Search, SlidersHorizontal, X } from "lucide-react"

import { useMotivosNotaCredito } from "@/modules/comprobantes/notas-credito/hooks/useMotivosNotaCredito"
import type { NotaCreditoFilters } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

const estados = ["BORRADOR", "REGISTRADA", "ANULADA"]
const estadosSunat = ["PENDIENTE", "ENVIADO", "ACEPTADO", "RECHAZADO", "ERROR"]
const setSelectValue = (value: string) => value === "all" ? "" : value

type Props = { filters: NotaCreditoFilters; onChange: (filters: NotaCreditoFilters) => void; onReset: () => void }

export function NotasCreditoFilters({ filters, onChange, onReset }: Props) {
  const { data: motivos = [], isLoading } = useMotivosNotaCredito()
  const update = (patch: Partial<NotaCreditoFilters>) => onChange({ ...filters, ...patch, page: 1 })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground"><SlidersHorizontal className="h-4 w-4" />Filtros</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input type="date" value={filters.fecha_inicio ?? ""} onChange={(event) => update({ fecha_inicio: event.target.value })} />
          <Input type="date" value={filters.fecha_fin ?? ""} onChange={(event) => update({ fecha_fin: event.target.value })} />
          <Select value={filters.estado || "all"} onValueChange={(value) => update({ estado: setSelectValue(value) })}>
            <SelectTrigger><SelectValue placeholder="Estado NC" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos los estados</SelectItem>{estados.map((estado) => <SelectItem key={estado} value={estado}>{estado}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filters.estado_sunat || "all"} onValueChange={(value) => update({ estado_sunat: setSelectValue(value) })}>
            <SelectTrigger><SelectValue placeholder="Estado SUNAT" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos SUNAT</SelectItem>{estadosSunat.map((estado) => <SelectItem key={estado} value={estado}>{estado}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filters.motivo_codigo || "all"} onValueChange={(value) => update({ motivo_codigo: setSelectValue(value) })}>
            <SelectTrigger><SelectValue placeholder={isLoading ? "Cargando motivos" : "Motivo"} /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos los motivos</SelectItem>{motivos.map((motivo) => <SelectItem key={motivo.codigo} value={motivo.codigo}>{motivo.codigo} {motivo.descripcion}</SelectItem>)}</SelectContent>
          </Select>
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Numero NC" value={filters.numero ?? ""} onChange={(event) => update({ numero: event.target.value })} /></div>
          <Input placeholder="Cliente" value={filters.cliente ?? ""} onChange={(event) => update({ cliente: event.target.value })} />
          <Input placeholder="Comprobante referencia" value={filters.comprobante_ref ?? ""} onChange={(event) => update({ comprobante_ref: event.target.value })} />
        </div>
        <div className="mt-3 flex justify-end"><Button type="button" variant="ghost" size="sm" onClick={onReset}><X className="mr-2 h-4 w-4" />Limpiar filtros</Button></div>
      </CardContent>
    </Card>
  )
}