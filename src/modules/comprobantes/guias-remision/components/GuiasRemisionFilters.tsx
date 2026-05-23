import { Search, SlidersHorizontal, X } from "lucide-react"

import type { GuiaRemisionFilters } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

const estados = ["BORRADOR", "REGISTRADA", "ANULADA"]
const estadosSunat = ["PENDIENTE", "ENVIADO", "ACEPTADO", "RECHAZADO", "ERROR"]
const motivos = [
  { value: "01", label: "01 Venta" },
  { value: "02", label: "02 Compra" },
  { value: "04", label: "04 Traslado entre establecimientos" },
  { value: "08", label: "08 Importacion" },
  { value: "09", label: "09 Exportacion" },
  { value: "13", label: "13 Otros" },
]
const modalidades = [
  { value: "01", label: "01 Transporte publico" },
  { value: "02", label: "02 Transporte privado" },
]

type Props = {
  filters: GuiaRemisionFilters
  onChange: (filters: GuiaRemisionFilters) => void
  onReset: () => void
}

function setSelectValue(value: string) {
  return value === "all" ? "" : value
}

export function GuiasRemisionFilters({ filters, onChange, onReset }: Props) {
  const update = (patch: Partial<GuiaRemisionFilters>) => onChange({ ...filters, ...patch, page: 1 })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input type="date" value={filters.fecha_inicio ?? ""} onChange={(event) => update({ fecha_inicio: event.target.value })} />
          <Input type="date" value={filters.fecha_fin ?? ""} onChange={(event) => update({ fecha_fin: event.target.value })} />
          <Select value={filters.estado || "all"} onValueChange={(value) => update({ estado: setSelectValue(value) })}>
            <SelectTrigger><SelectValue placeholder="Estado guia" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {estados.map((estado) => <SelectItem key={estado} value={estado}>{estado}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.estado_sunat || "all"} onValueChange={(value) => update({ estado_sunat: setSelectValue(value) })}>
            <SelectTrigger><SelectValue placeholder="Estado SUNAT" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos SUNAT</SelectItem>
              {estadosSunat.map((estado) => <SelectItem key={estado} value={estado}>{estado}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.motivo_traslado_codigo || "all"} onValueChange={(value) => update({ motivo_traslado_codigo: setSelectValue(value) })}>
            <SelectTrigger><SelectValue placeholder="Motivo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los motivos</SelectItem>
              {motivos.map((motivo) => <SelectItem key={motivo.value} value={motivo.value}>{motivo.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.modalidad_transporte || "all"} onValueChange={(value) => update({ modalidad_transporte: setSelectValue(value) })}>
            <SelectTrigger><SelectValue placeholder="Modalidad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las modalidades</SelectItem>
              {modalidades.map((modalidad) => <SelectItem key={modalidad.value} value={modalidad.value}>{modalidad.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Numero de guia" value={filters.numero ?? ""} onChange={(event) => update({ numero: event.target.value })} />
          </div>
          <Input placeholder="Destinatario" value={filters.destinatario ?? ""} onChange={(event) => update({ destinatario: event.target.value })} />
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onReset}>
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
