import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { PagoProveedorAnularDialog } from "@/modules/compras/pagos-proveedor/components/PagoProveedorAnularDialog"
import { PagoProveedorFilters } from "@/modules/compras/pagos-proveedor/components/PagoProveedorFilters"
import { PagoProveedorFormModal } from "@/modules/compras/pagos-proveedor/components/PagoProveedorFormModal"
import { PagosProveedorTable } from "@/modules/compras/pagos-proveedor/components/PagosProveedorTable"
import { usePagoProveedorMutations } from "@/modules/compras/pagos-proveedor/hooks/usePagoProveedorMutations"
import { usePagosProveedor } from "@/modules/compras/pagos-proveedor/hooks/usePagosProveedor"
import type { AnularPagoProveedorPayload, PagoProveedor, PagoProveedorFilters as Filters } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function PagosProveedorPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const [formOpen, setFormOpen] = useState(false)
  const [anularTarget, setAnularTarget] = useState<PagoProveedor | null>(null)
  const query = usePagosProveedor(filters)
  const mutations = usePagoProveedorMutations()

  async function anular(values: AnularPagoProveedorPayload) {
    if (!anularTarget) return
    try {
      await mutations.anular.mutateAsync({ id: anularTarget.id, values })
      toast.success("Pago anulado correctamente")
      setAnularTarget(null)
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo anular el pago."))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h1 className="text-2xl font-semibold tracking-tight">Pagos proveedor</h1><p className="text-sm text-muted-foreground">Registra pagos para reducir cuentas por pagar.</p></div>
        <Button onClick={() => setFormOpen(true)}><Plus className="mr-2 h-4 w-4" />Registrar pago</Button>
      </div>
      <Card><CardContent className="pt-6"><PagoProveedorFilters filters={filters} onChange={setFilters} /></CardContent></Card>
      {query.isLoading ? <Skeleton className="h-96 w-full" /> : query.isError ? <Alert variant="destructive"><AlertTitle>No se pudo cargar pagos</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert> : query.data?.data.length ? <Card><CardContent className="space-y-4 pt-6"><PagosProveedorTable pagos={query.data.data} onAnular={setAnularTarget} /><AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(per_page) => setFilters((current) => ({ ...current, per_page, page: 1 }))} /></CardContent></Card> : <Alert><AlertTitle>Sin pagos</AlertTitle><AlertDescription>No hay pagos proveedor con los filtros seleccionados.</AlertDescription></Alert>}
      <PagoProveedorFormModal open={formOpen} onOpenChange={setFormOpen} />
      <PagoProveedorAnularDialog open={Boolean(anularTarget)} pago={anularTarget} loading={mutations.anular.isPending} onOpenChange={(open) => !open && setAnularTarget(null)} onConfirm={anular} />
    </div>
  )
}