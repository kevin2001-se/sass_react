import { useState } from "react"
import { AlertCircle } from "lucide-react"

import { VentaFilters } from "@/modules/ventas/components/VentaFilters"
import { VentasTable } from "@/modules/ventas/components/VentasTable"
import { useVentas } from "@/modules/ventas/hooks/useVentas"
import type { VentaFilters as VentaFiltersType } from "@/modules/ventas/types/venta.types"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

const initialFilters: VentaFiltersType = { page: 1, per_page: 15 }

export function VentasHistorialPage() {
  const [filters, setFilters] = useState<VentaFiltersType>(initialFilters)
  const { data, isLoading, isError, refetch } = useVentas(filters)
  const ventas = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Historial de ventas</h1>
        <p className="text-sm text-muted-foreground">Consulta ventas, pagos, clientes y comprobantes de la tienda activa.</p>
      </div>

      <VentaFilters filters={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No se pudo cargar el historial</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-3">
            <span>Revisa la conexion con la API o vuelve a intentarlo.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>Reintentar</Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ventas registradas</CardTitle>
          {meta ? <span className="text-sm text-muted-foreground">{meta.total} registros</span> : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <VentasTable ventas={ventas} isLoading={isLoading} />
          {meta ? (
            <AppPagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              perPage={Number(meta.per_page)}
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