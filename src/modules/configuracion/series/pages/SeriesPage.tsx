import { useState } from "react"
import { MoreHorizontal, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { AdminEmptyState } from "@/modules/configuracion/shared/AdminEmptyState"
import { StatusBadge } from "@/modules/configuracion/shared/StatusBadge"
import { useTiendas } from "@/modules/configuracion/tiendas/hooks/useTiendas"
import { SerieModal } from "@/modules/configuracion/series/components/SerieModal"
import { useSerieMutations, useSeries } from "@/modules/configuracion/series/hooks/useSeries"
import { tipoComprobanteOptions, type SerieComprobante, type SerieFilters, type SerieFormValues } from "@/modules/configuracion/series/types/serie.types"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"

export function SeriesPage() {
  const [filters, setFilters] = useState<SerieFilters>({ page: 1, per_page: 15 })
  const [selected, setSelected] = useState<SerieComprobante | null>(null)
  const [open, setOpen] = useState(false)
  const query = useSeries(filters)
  const tiendas = useTiendas({ per_page: 100 })
  const mutations = useSerieMutations()
  const activeMutation = selected ? mutations.update : mutations.create
  async function save(values: SerieFormValues) { try { selected ? await mutations.update.mutateAsync({ id: selected.id, values }) : await mutations.create.mutateAsync(values); toast.success("Serie guardada correctamente."); setOpen(false); setSelected(null) } catch (e) { toast.error(getLaravelErrorMessage(e, "No se pudo guardar la serie.")) } }
  async function deactivate(s: SerieComprobante) { try { await mutations.remove.mutateAsync(s.id); toast.success("Serie desactivada correctamente.") } catch (e) { toast.error(getLaravelErrorMessage(e, "No se pudo desactivar la serie.")) } }
  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Series</h1><p className="text-sm text-muted-foreground">Series por tienda y tipo de comprobante.</p></div><Button onClick={() => { setSelected(null); setOpen(true) }}><Plus className="mr-2 h-4 w-4" />Nueva serie</Button></div><Card><CardContent className="grid gap-3 pt-6 md:grid-cols-2"><AppCombobox value={filters.tienda_id ?? null} onChange={(v) => setFilters((f) => ({ ...f, tienda_id: v ? Number(v) : undefined, page: 1 }))} options={(tiendas.data?.data ?? []).map((t) => ({ value: t.id, label: t.nombre, description: t.codigo ?? undefined }))} placeholder="Todas las tiendas" /><AppCombobox value={filters.tipo_comprobante ?? null} onChange={(v) => setFilters((f) => ({ ...f, tipo_comprobante: v ? String(v) : undefined, page: 1 }))} options={tipoComprobanteOptions} placeholder="Todos los tipos" /></CardContent></Card>{query.isLoading ? <Skeleton className="h-80" /> : query.data?.data.length ? <Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>Tienda</TableHead><TableHead>Tipo</TableHead><TableHead>Serie</TableHead><TableHead>Correlativo</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{query.data.data.map((s) => <TableRow key={s.id}><TableCell>{s.tienda?.nombre ?? s.tienda_id}</TableCell><TableCell>{tipoComprobanteOptions.find((o) => o.value === s.tipo_comprobante)?.label ?? s.tipo_comprobante}</TableCell><TableCell className="font-medium">{s.serie}</TableCell><TableCell>{s.correlativo_actual}</TableCell><TableCell><StatusBadge active={s.estado} /></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setSelected(s); setOpen(true) }}>Editar</DropdownMenuItem>{s.estado ? <DropdownMenuItem onClick={() => deactivate(s)}>Desactivar</DropdownMenuItem> : null}</DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table><AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} onPerPageChange={(per_page) => setFilters((f) => ({ ...f, per_page, page: 1 }))} /></CardContent></Card> : <AdminEmptyState title="Sin series" description="Crea series por tienda para emitir documentos." />}<SerieModal open={open} serie={selected} tiendas={tiendas.data?.data ?? []} isSubmitting={activeMutation.isPending} serverErrors={getLaravelValidationErrors(activeMutation.error)} onOpenChange={setOpen} onSubmit={save} /></div>
}