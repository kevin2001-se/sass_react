import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { CuentaPagarFilters } from "@/modules/compras/cuentas-pagar/components/CuentaPagarFilters"
import { CuentasPagarTable } from "@/modules/compras/cuentas-pagar/components/CuentasPagarTable"
import { useCuentasPagar } from "@/modules/compras/cuentas-pagar/hooks/useCuentasPagar"
import type { CuentaPagarFilters as Filters } from "@/modules/compras/cuentas-pagar/types/cuentaPagar.types"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function CuentasPagarPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const query = useCuentasPagar(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cuentas por pagar</h1>
        <p className="text-sm text-muted-foreground">Consulta obligaciones generadas automaticamente desde compras a credito.</p>
      </div>

      <Card><CardContent className="pt-6"><CuentaPagarFilters filters={filters} onChange={setFilters} /></CardContent></Card>

      {query.isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : query.isError ? (
        <Alert variant="destructive"><AlertTitle>No se pudo cargar cuentas por pagar</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert>
      ) : query.data?.data.length ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <CuentasPagarTable cuentas={query.data.data} />
            <AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(per_page) => setFilters((current) => ({ ...current, per_page, page: 1 }))} />
          </CardContent>
        </Card>
      ) : (
        <Alert><AlertTitle>Sin cuentas por pagar</AlertTitle><AlertDescription>No hay cuentas por pagar con los filtros seleccionados.</AlertDescription></Alert>
      )}
    </div>
  )
}