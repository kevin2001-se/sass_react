import { AlertCircle } from "lucide-react"
import { useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { getLaravelErrorMessage } from "@/shared/services/api"

import { GenerarResumenDiarioModal } from "../components/GenerarResumenDiarioModal"
import { ResumenDiarioFilters } from "../components/ResumenDiarioFilters"
import { ResumenDiarioTable } from "../components/ResumenDiarioTable"
import { useResumenDiarioActions } from "../hooks/useResumenDiarioActions"
import { useResumenesDiarios } from "../hooks/useResumenesDiarios"
import type { GenerarResumenDiarioPayload, ResumenDiarioFilters as Filters } from "../types/resumenDiario.types"

const initialFilters: Filters = { page: 1, per_page: 15 }

export function ResumenDiarioPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [openGenerar, setOpenGenerar] = useState(false)
  const resumenes = useResumenesDiarios(filters)
  const actions = useResumenDiarioActions()

  const handleGenerar = async (payload: GenerarResumenDiarioPayload) => {
    await actions.generar.mutateAsync(payload)
    setOpenGenerar(false)
    setFilters((current) => ({ ...current, page: 1 }))
  }

  const meta = resumenes.data?.meta ?? { current_page: 1, last_page: 1, per_page: filters.per_page ?? 15, total: 0 }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resumen diario</h1>
          <p className="text-sm text-muted-foreground">Agrupa boletas, notas de credito y notas de debito de boletas para envio SUNAT.</p>
        </div>
        <GenerarResumenDiarioModal open={openGenerar} onOpenChange={setOpenGenerar} onSubmit={handleGenerar} loading={actions.generar.isPending} />
      </div>

      <ResumenDiarioFilters filters={filters} onChange={setFilters} onClear={() => setFilters(initialFilters)} />

      {resumenes.isLoading ? (
        <Card>
          <CardHeader><CardTitle>Cargando resumenes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : null}

      {resumenes.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No se pudo cargar resumenes diarios</AlertTitle>
          <AlertDescription>{getLaravelErrorMessage(resumenes.error, "Intenta nuevamente en unos segundos.")}</AlertDescription>
        </Alert>
      ) : null}

      {resumenes.data ? (
        <div className="space-y-4">
          <ResumenDiarioTable data={resumenes.data.data} />
          <AppPagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            perPage={meta.per_page}
            total={meta.total}
            onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
            onPerPageChange={(perPage) => setFilters((current) => ({ ...current, per_page: perPage, page: 1 }))}
          />
        </div>
      ) : null}
    </div>
  )
}