import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { AnularPagoClienteDialog } from "../components/AnularPagoClienteDialog"
import { PagoClienteFilters } from "../components/PagoClienteFilters"
import { PagosClienteTable } from "../components/PagosClienteTable"
import { usePagosCliente } from "../hooks/usePagosCliente"
import type { PagoCliente, PagoClienteFilters as Filters } from "../types/cuentaCobrar.types"
export function PagosClientePage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const [pagoAnular, setPagoAnular] = useState<PagoCliente | null>(null)
  const query = usePagosCliente(filters)
  return <div className="space-y-6"><div><h1 className="text-2xl font-semibold tracking-tight">Pagos de clientes</h1><p className="text-sm text-muted-foreground">Consulta y anula pagos registrados sobre cuentas por cobrar.</p></div><Card><CardContent className="pt-6"><PagoClienteFilters filters={filters} onChange={setFilters} /></CardContent></Card>{query.isLoading ? <Skeleton className="h-96 w-full" /> : query.isError ? <Alert variant="destructive"><AlertTitle>No se pudo cargar pagos</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert> : query.data?.data.length ? <Card><CardContent className="space-y-4 pt-6"><PagosClienteTable pagos={query.data.data} onAnular={setPagoAnular} /><AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(per_page) => setFilters((current) => ({ ...current, per_page, page: 1 }))} /></CardContent></Card> : <Alert><AlertTitle>Sin pagos</AlertTitle><AlertDescription>No hay pagos de clientes con los filtros seleccionados.</AlertDescription></Alert>}<AnularPagoClienteDialog pago={pagoAnular} open={Boolean(pagoAnular)} onOpenChange={(open) => !open && setPagoAnular(null)} /></div>
}
