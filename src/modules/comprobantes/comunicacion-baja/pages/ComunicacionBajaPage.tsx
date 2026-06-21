import { AlertCircle } from "lucide-react"
import { useState } from "react"

import { AppPagination } from "@/shared/components/table/AppPagination"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage } from "@/shared/services/api"

import { ComunicacionBajaFilters } from "../components/ComunicacionBajaFilters"
import { ComunicacionBajaTable } from "../components/ComunicacionBajaTable"
import { GenerarComunicacionBajaModal } from "../components/GenerarComunicacionBajaModal"
import { useComunicacionBajaActions } from "../hooks/useComunicacionBajaActions"
import { useComunicacionesBaja } from "../hooks/useComunicacionesBaja"
import type { ComunicacionBajaFilters as Filters, GenerarComunicacionBajaPayload } from "../types/comunicacionBaja.types"

const initialFilters: Filters = { page: 1, per_page: 15 }

export function ComunicacionBajaPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [openGenerar, setOpenGenerar] = useState(false)
  const comunicaciones = useComunicacionesBaja(filters)
  const actions = useComunicacionBajaActions()

  const handleGenerar = async (payload: GenerarComunicacionBajaPayload) => {
    await actions.generar.mutateAsync(payload)
    setOpenGenerar(false)
    setFilters((current) => ({ ...current, page: 1 }))
  }

  const meta = comunicaciones.data?.meta ?? { current_page: 1, last_page: 1, per_page: filters.per_page ?? 15, total: 0 }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Comunicacion de baja</h1>
          <p className="text-sm text-muted-foreground">Agrupa comprobantes con baja interna pendiente para informar a SUNAT.</p>
        </div>
        <GenerarComunicacionBajaModal open={openGenerar} onOpenChange={setOpenGenerar} onSubmit={handleGenerar} loading={actions.generar.isPending} />
      </div>

      <ComunicacionBajaFilters filters={filters} onChange={setFilters} onClear={() => setFilters(initialFilters)} />

      {comunicaciones.isLoading ? (
        <Card>
          <CardHeader><CardTitle>Cargando comunicaciones</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : null}

      {comunicaciones.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No se pudo cargar comunicaciones de baja</AlertTitle>
          <AlertDescription>{getLaravelErrorMessage(comunicaciones.error, "Intenta nuevamente en unos segundos.")}</AlertDescription>
        </Alert>
      ) : null}

      {comunicaciones.data ? (
        <div className="space-y-4">
          <ComunicacionBajaTable data={comunicaciones.data.data} />
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
