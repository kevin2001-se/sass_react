import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { AdminEmptyState } from "@/modules/configuracion/shared/AdminEmptyState"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { TiendaModal } from "@/modules/configuracion/tiendas/components/TiendaModal"
import { TiendasTable } from "@/modules/configuracion/tiendas/components/TiendasTable"
import { useTiendaMutations, useTiendas } from "@/modules/configuracion/tiendas/hooks/useTiendas"
import type { Tienda, TiendaFilters, TiendaFormValues } from "@/modules/configuracion/tiendas/types/tienda.types"

export function TiendasPage() {
  const [filters, setFilters] = useState<TiendaFilters>({ page: 1, per_page: 15 })
  const [selected, setSelected] = useState<Tienda | null>(null)
  const [open, setOpen] = useState(false)
  const query = useTiendas(filters)
  const mutations = useTiendaMutations()
  const activeMutation = selected ? mutations.update : mutations.create
  async function save(values: TiendaFormValues) { try { selected ? await mutations.update.mutateAsync({ id: selected.id, values }) : await mutations.create.mutateAsync(values); toast.success("Tienda guardada correctamente."); setOpen(false); setSelected(null) } catch (e) { toast.error(getLaravelErrorMessage(e, "No se pudo guardar la tienda.")) } }
  async function deactivate(t: Tienda) { try { await mutations.remove.mutateAsync(t.id); toast.success("Tienda desactivada correctamente.") } catch (e) { toast.error(getLaravelErrorMessage(e, "No se pudo desactivar la tienda.")) } }
  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Tiendas</h1><p className="text-sm text-muted-foreground">Mantenimiento de tiendas de la empresa.</p></div><Button onClick={() => { setSelected(null); setOpen(true) }}><Plus className="mr-2 h-4 w-4" />Nueva tienda</Button></div><Card><CardContent className="flex flex-col gap-3 pt-6 md:flex-row"><Input placeholder="Buscar tienda..." value={filters.q ?? ""} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))} /><Select value={filters.estado ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, estado: v === "all" ? undefined : v, page: 1 }))}><SelectTrigger className="md:w-48"><SelectValue placeholder="Estado" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="true">Activas</SelectItem><SelectItem value="false">Inactivas</SelectItem></SelectContent></Select></CardContent></Card>{query.isLoading ? <Skeleton className="h-80 w-full" /> : query.data?.data.length ? <Card><CardContent className="pt-6"><TiendasTable tiendas={query.data.data} onEdit={(t) => { setSelected(t); setOpen(true) }} onDeactivate={deactivate} /><AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} onPerPageChange={(per_page) => setFilters((f) => ({ ...f, per_page, page: 1 }))} /></CardContent></Card> : <AdminEmptyState title="Sin tiendas" description="Crea una tienda para operar ventas, inventario y series." />}<TiendaModal open={open} tienda={selected} isSubmitting={activeMutation.isPending} serverErrors={getLaravelValidationErrors(activeMutation.error)} onOpenChange={setOpen} onSubmit={save} /></div>
}