import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { ProveedorDeleteDialog } from "@/modules/compras/proveedores/components/ProveedorDeleteDialog"
import { ProveedorFilters } from "@/modules/compras/proveedores/components/ProveedorFilters"
import { ProveedorFormModal } from "@/modules/compras/proveedores/components/ProveedorFormModal"
import { ProveedoresTable } from "@/modules/compras/proveedores/components/ProveedoresTable"
import { useProveedorMutations } from "@/modules/compras/proveedores/hooks/useProveedorMutations"
import { useProveedores } from "@/modules/compras/proveedores/hooks/useProveedores"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import type { Proveedor, ProveedorFilters as Filters, ProveedorFormValues } from "@/modules/compras/proveedores/types/proveedor.types"

export function ProveedoresPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const [selected, setSelected] = useState<Proveedor | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Proveedor | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const query = useProveedores(filters)
  const mutations = useProveedorMutations()
  const activeMutation = selected ? mutations.update : mutations.create

  function openCreate() { setSelected(null); setFormOpen(true) }
  function openEdit(proveedor: Proveedor) { setSelected(proveedor); setFormOpen(true) }

  async function save(values: ProveedorFormValues) {
    try {
      selected ? await mutations.update.mutateAsync({ id: selected.id, values }) : await mutations.create.mutateAsync(values)
      toast.success("Proveedor guardado correctamente.")
      setFormOpen(false)
      setSelected(null)
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo guardar el proveedor."))
    }
  }

  async function deactivate() {
    if (!deleteTarget) return
    try {
      await mutations.remove.mutateAsync(deleteTarget.id)
      toast.success("Proveedor desactivado correctamente.")
      setDeleteTarget(null)
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo desactivar el proveedor."))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-semibold tracking-tight">Proveedores</h1><p className="text-sm text-muted-foreground">Mantenimiento de proveedores de la empresa.</p></div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Nuevo proveedor</Button>
      </div>

      <Card><CardContent className="pt-6"><ProveedorFilters filters={filters} onChange={setFilters} /></CardContent></Card>

      {query.isLoading ? <Skeleton className="h-96 w-full" /> : query.isError ? <Alert variant="destructive"><AlertTitle>No se pudo cargar proveedores</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error, "Intenta recargar la página.")}</AlertDescription></Alert> : query.data?.data.length ? (
        <Card><CardContent className="pt-6"><ProveedoresTable proveedores={query.data.data} onEdit={openEdit} onDelete={setDeleteTarget} /><AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(per_page) => setFilters((current) => ({ ...current, per_page, page: 1 }))} /></CardContent></Card>
      ) : <Alert><AlertTitle>Sin proveedores</AlertTitle><AlertDescription>Registra proveedores para usarlos luego en compras y cuentas por pagar.</AlertDescription></Alert>}

      <ProveedorFormModal open={formOpen} proveedor={selected} isSubmitting={activeMutation.isPending} serverErrors={getLaravelValidationErrors(activeMutation.error)} onOpenChange={setFormOpen} onSubmit={save} />
      <ProveedorDeleteDialog open={Boolean(deleteTarget)} proveedor={deleteTarget} loading={mutations.remove.isPending} onOpenChange={(open) => !open && setDeleteTarget(null)} onConfirm={deactivate} />
    </div>
  )
}