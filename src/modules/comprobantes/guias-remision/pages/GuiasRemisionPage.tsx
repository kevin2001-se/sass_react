import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Plus, ShoppingCart } from "lucide-react"

import { GuiasRemisionFilters } from "@/modules/comprobantes/guias-remision/components/GuiasRemisionFilters"
import { GuiasRemisionTable } from "@/modules/comprobantes/guias-remision/components/GuiasRemisionTable"
import { useGuiasRemision } from "@/modules/comprobantes/guias-remision/hooks/useGuiasRemision"
import type { GuiaRemisionFilters } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { AppPagination } from "@/shared/components/table/AppPagination"

const initialFilters: GuiaRemisionFilters = {
  page: 1,
  per_page: 15,
}

export function GuiasRemisionPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<GuiaRemisionFilters>(initialFilters)
  const { data, isLoading, isError, error } = useGuiasRemision(filters)

  const guias = data?.data ?? []
  const meta = data?.meta ?? { current_page: filters.page ?? 1, last_page: 1, per_page: filters.per_page ?? 15, total: 0 }

  const errorMessage = useMemo(() => {
    if (!isError) return null
    return error instanceof Error ? error.message : "No se pudieron cargar las guias de remision."
  }, [error, isError])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Guias de remision</h1>
          <p className="text-sm text-muted-foreground">Consulta guias remitente por tienda activa, estado y trazabilidad SUNAT.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate("/comprobantes/guias-remision/desde-venta")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Nueva desde venta
          </Button>
          <Button onClick={() => navigate("/comprobantes/guias-remision/nueva")}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva guia
          </Button>
        </div>
      </div>

      <GuiasRemisionFilters filters={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />

      {errorMessage ? (
        <Alert variant="destructive">
          <FileText className="h-4 w-4" />
          <AlertTitle>No se pudo cargar el listado</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Listado de guias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <GuiasRemisionTable guias={guias} isLoading={isLoading} />
          {!isLoading && !isError ? (
            <AppPagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              perPage={meta.per_page}
              total={meta.total}
              onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
              onPerPageChange={(perPage) => setFilters((current) => ({ ...current, page: 1, per_page: perPage }))}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
