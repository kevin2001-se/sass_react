import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { CuentaCobrarFilters } from "../components/CuentaCobrarFilters"
import { CuentasCobrarTable } from "../components/CuentasCobrarTable"
import { RegistrarPagoClienteModal } from "../components/RegistrarPagoClienteModal"
import { useCuentasCobrar } from "../hooks/useCuentasCobrar"
import type { CuentaCobrar, CuentaCobrarFilters as Filters } from "../types/cuentaCobrar.types"
export function CuentasCobrarPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const [cuentaPago, setCuentaPago] = useState<CuentaCobrar | null>(null)
  const query = useCuentasCobrar(filters)
  return <div className="space-y-6"><div><h1 className="text-2xl font-semibold tracking-tight">Cuentas por cobrar</h1><p className="text-sm text-muted-foreground">Consulta deudas generadas por ventas al credito.</p></div><Card><CardContent className="pt-6"><CuentaCobrarFilters filters={filters} onChange={setFilters} /></CardContent></Card>{query.isLoading ? <Skeleton className="h-96 w-full" /> : query.isError ? <Alert variant="destructive"><AlertTitle>No se pudo cargar cuentas por cobrar</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert> : query.data?.data.length ? <Card><CardContent className="space-y-4 pt-6"><CuentasCobrarTable cuentas={query.data.data} onPagar={setCuentaPago} /><AppPagination currentPage={query.data.meta.current_page} lastPage={query.data.meta.last_page} perPage={query.data.meta.per_page} total={query.data.meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(per_page) => setFilters((current) => ({ ...current, per_page, page: 1 }))} /></CardContent></Card> : <Alert><AlertTitle>Sin cuentas por cobrar</AlertTitle><AlertDescription>No hay cuentas por cobrar con los filtros seleccionados.</AlertDescription></Alert>}<RegistrarPagoClienteModal cuenta={cuentaPago} open={Boolean(cuentaPago)} onOpenChange={(open) => !open && setCuentaPago(null)} /></div>
}
