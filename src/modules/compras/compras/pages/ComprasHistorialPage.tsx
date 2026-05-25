import { useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { CompraAnularDialog } from "@/modules/compras/compras/components/CompraAnularDialog"
import { CompraFilters } from "@/modules/compras/compras/components/CompraFilters"
import { ComprasTable } from "@/modules/compras/compras/components/ComprasTable"
import { useCompraMutations } from "@/modules/compras/compras/hooks/useCompraMutations"
import { useCompras } from "@/modules/compras/compras/hooks/useCompras"
import type { Compra, CompraFilters as Filters } from "@/modules/compras/compras/types/compra.types"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function ComprasHistorialPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const [anularTarget, setAnularTarget] = useState<Compra | null>(null)
  const query = useCompras(filters)
  const mutations = useCompraMutations()

  async function anular(values: { motivo: string }) {
    if (!anularTarget) return
    try {
      await mutations.anular.mutateAsync({ id: anularTarget.id, values })
      toast.success("Compra anulada correctamente. Stock revertido.")
      setAnularTarget(null)
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo anular la compra."))
    }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Historial de compras</h1><p className="text-sm text-muted-foreground">Consulta compras registradas, PDF y anulación con reverso de stock.</p></div>
      <Card><CardContent className="pt-6"><CompraFilters filters={filters} onChange={setFilters} /></CardContent></Card>
      {query.isLoading ? <Skeleton className="h-96 w-full" /> : query.isError ? <Alert variant="destructive"><AlertTitle>No se pudo cargar compras</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert> : query.data?.data.length ? <Card><CardContent className="space-y-4 pt-6"><ComprasTable compras={query.data.data} onAnular={setAnularTarget} /><AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(per_page) => setFilters((current) => ({ ...current, per_page, page: 1 }))} /></CardContent></Card> : <Alert><AlertTitle>Sin compras</AlertTitle><AlertDescription>No hay compras con los filtros seleccionados.</AlertDescription></Alert>}
      <CompraAnularDialog open={Boolean(anularTarget)} compra={anularTarget} loading={mutations.anular.isPending} onOpenChange={(open) => !open && setAnularTarget(null)} onConfirm={anular} />
    </div>
  )
}
