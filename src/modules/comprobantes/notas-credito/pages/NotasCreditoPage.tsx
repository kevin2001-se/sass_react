import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Plus } from "lucide-react"

import { NotasCreditoFilters } from "@/modules/comprobantes/notas-credito/components/NotasCreditoFilters"
import { NotasCreditoTable } from "@/modules/comprobantes/notas-credito/components/NotasCreditoTable"
import { useNotasCredito } from "@/modules/comprobantes/notas-credito/hooks/useNotasCredito"
import type { NotaCreditoFilters } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

const initialFilters: NotaCreditoFilters = { page: 1, per_page: 15 }

export function NotasCreditoPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<NotaCreditoFilters>(initialFilters)
  const { data, isLoading, isError, error } = useNotasCredito(filters)
  const notas = data?.data ?? []
  const meta = data?.meta ?? { current_page: filters.page ?? 1, last_page: 1, per_page: filters.per_page ?? 15, total: 0 }
  const errorMessage = useMemo(() => isError ? (error instanceof Error ? error.message : "No se pudieron cargar las notas de credito.") : null, [error, isError])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Notas de credito</h1><p className="text-sm text-muted-foreground">Consulta notas emitidas para boletas y facturas aceptadas por SUNAT.</p></div><Button onClick={() => navigate("/comprobantes/notas-credito/nueva")}><Plus className="mr-2 h-4 w-4" />Nueva nota</Button></div>
      <NotasCreditoFilters filters={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
      {errorMessage ? <Alert variant="destructive"><FileText className="h-4 w-4" /><AlertTitle>No se pudo cargar el listado</AlertTitle><AlertDescription>{errorMessage}</AlertDescription></Alert> : null}
      <Card><CardHeader><CardTitle>Listado de notas</CardTitle></CardHeader><CardContent className="space-y-4"><NotasCreditoTable notas={notas} isLoading={isLoading} />{!isLoading && !isError ? <AppPagination currentPage={meta.current_page} lastPage={meta.last_page} perPage={meta.per_page} total={meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(perPage) => setFilters((current) => ({ ...current, page: 1, per_page: perPage }))} /> : null}</CardContent></Card>
    </div>
  )
}