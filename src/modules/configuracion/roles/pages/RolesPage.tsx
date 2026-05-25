import { useState } from "react"
import { MoreHorizontal, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { AdminEmptyState } from "@/modules/configuracion/shared/AdminEmptyState"
import { StatusBadge } from "@/modules/configuracion/shared/StatusBadge"
import { RoleModal } from "@/modules/configuracion/roles/components/RoleModal"
import { usePermisos, useRoleMutations, useRoles } from "@/modules/configuracion/roles/hooks/useRoles"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import type { Role, RoleFilters, RoleFormValues } from "@/modules/configuracion/roles/types/role.types"

export function RolesPage() {
  const [filters, setFilters] = useState<RoleFilters>({ page: 1, per_page: 15 })
  const [selected, setSelected] = useState<Role | null>(null)
  const [open, setOpen] = useState(false)
  const query = useRoles(filters)
  const permisos = usePermisos()
  const mutations = useRoleMutations()
  const activeMutation = selected ? mutations.update : mutations.create
  async function save(values: RoleFormValues) { try { selected ? await mutations.update.mutateAsync({ id: selected.id, values }) : await mutations.create.mutateAsync(values); toast.success("Rol guardado correctamente."); setOpen(false); setSelected(null) } catch (e) { toast.error(getLaravelErrorMessage(e, "No se pudo guardar el rol.")) } }
  async function deactivate(role: Role) { try { await mutations.remove.mutateAsync(role.id); toast.success("Rol desactivado correctamente.") } catch (e) { toast.error(getLaravelErrorMessage(e, "No se pudo desactivar el rol.")) } }
  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Roles y permisos</h1><p className="text-sm text-muted-foreground">Administra roles y permisos agrupados por módulo.</p></div><Button onClick={() => { setSelected(null); setOpen(true) }}><Plus className="mr-2 h-4 w-4" />Nuevo rol</Button></div><Card><CardContent className="pt-6"><Input placeholder="Buscar rol..." value={filters.q ?? ""} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))} /></CardContent></Card>{query.isLoading ? <Skeleton className="h-80" /> : query.data?.data.length ? <Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>Rol</TableHead><TableHead>Permisos</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{query.data.data.map((r) => <TableRow key={r.id}><TableCell className="font-medium">{r.name}<span className="block text-xs text-muted-foreground">{r.description}</span></TableCell><TableCell>{r.permissions?.length ?? 0}</TableCell><TableCell><StatusBadge active={r.active} /></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setSelected(r); setOpen(true) }}>Editar</DropdownMenuItem>{r.active ? <DropdownMenuItem onClick={() => deactivate(r)}>Desactivar</DropdownMenuItem> : null}</DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table><AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} onPerPageChange={(per_page) => setFilters((f) => ({ ...f, per_page, page: 1 }))} /></CardContent></Card> : <AdminEmptyState title="Sin roles" description="Crea roles para controlar el acceso por permisos." />}<RoleModal open={open} role={selected} permisos={permisos.data ?? []} isSubmitting={activeMutation.isPending} serverErrors={getLaravelValidationErrors(activeMutation.error)} onOpenChange={setOpen} onSubmit={save} /></div>
}