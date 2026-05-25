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
import { useRoles } from "@/modules/configuracion/roles/hooks/useRoles"
import { useTiendas } from "@/modules/configuracion/tiendas/hooks/useTiendas"
import { UsuarioModal } from "@/modules/configuracion/usuarios/components/UsuarioModal"
import { useUsuarioMutations, useUsuarios } from "@/modules/configuracion/usuarios/hooks/useUsuarios"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import type { Usuario, UsuarioFilters, UsuarioFormValues } from "@/modules/configuracion/usuarios/types/usuario.types"

export function UsuariosPage() {
  const [filters, setFilters] = useState<UsuarioFilters>({ page: 1, per_page: 15 })
  const [selected, setSelected] = useState<Usuario | null>(null)
  const [open, setOpen] = useState(false)
  const query = useUsuarios(filters)
  const roles = useRoles({ per_page: 100 })
  const tiendas = useTiendas({ per_page: 100 })
  const mutations = useUsuarioMutations()
  const activeMutation = selected ? mutations.update : mutations.create
  async function save(values: UsuarioFormValues) { try { selected ? await mutations.update.mutateAsync({ id: selected.id, values }) : await mutations.create.mutateAsync(values); toast.success("Usuario guardado correctamente."); setOpen(false); setSelected(null) } catch (e) { toast.error(getLaravelErrorMessage(e, "No se pudo guardar el usuario.")) } }
  async function deactivate(u: Usuario) { try { await mutations.remove.mutateAsync(u.id); toast.success("Usuario desactivado correctamente.") } catch (e) { toast.error(getLaravelErrorMessage(e, "No se pudo desactivar el usuario.")) } }
  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1><p className="text-sm text-muted-foreground">Usuarios, roles y acceso por tienda.</p></div><Button onClick={() => { setSelected(null); setOpen(true) }}><Plus className="mr-2 h-4 w-4" />Nuevo usuario</Button></div><Card><CardContent className="pt-6"><Input placeholder="Buscar usuario..." value={filters.q ?? ""} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))} /></CardContent></Card>{query.isLoading ? <Skeleton className="h-80" /> : query.data?.data.length ? <Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>Usuario</TableHead><TableHead>Rol</TableHead><TableHead>Tiendas</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{query.data.data.map((u) => <TableRow key={u.id}><TableCell className="font-medium">{u.name}<span className="block text-xs text-muted-foreground">{u.email}</span></TableCell><TableCell>{u.role?.name ?? "-"}</TableCell><TableCell>{u.tiendas?.map((t) => t.nombre).join(", ")}</TableCell><TableCell><StatusBadge active={u.estado} /></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setSelected(u); setOpen(true) }}>Editar</DropdownMenuItem>{u.estado ? <DropdownMenuItem onClick={() => deactivate(u)}>Desactivar</DropdownMenuItem> : null}</DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table><AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} onPerPageChange={(per_page) => setFilters((f) => ({ ...f, per_page, page: 1 }))} /></CardContent></Card> : <AdminEmptyState title="Sin usuarios" description="Crea usuarios y asígnales tiendas y rol." />}<UsuarioModal open={open} usuario={selected} roles={roles.data?.data ?? []} tiendas={tiendas.data?.data ?? []} isSubmitting={activeMutation.isPending} serverErrors={getLaravelValidationErrors(activeMutation.error)} onOpenChange={setOpen} onSubmit={save} /></div>
}