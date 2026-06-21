import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { ReporteExportActions } from "@/modules/reportes/components/ReporteExportActions"
import { ReporteFilters } from "@/modules/reportes/components/ReporteFilters"
import { ReporteMetricCard } from "@/modules/reportes/components/ReporteMetricCard"
import { ReporteTable } from "@/modules/reportes/components/ReporteTable"
import { useCajaCierres, useCajaMetodosPago, useCajaResumen } from "@/modules/reportes/hooks/useReportes"
import { formatCurrency, formatDate, type GenericRecord, type ReporteFilters as Filters } from "@/modules/reportes/types/reporte.types"

export function ReporteCajaPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const resumen = useCajaResumen(filters)
  const metodos = useCajaMetodosPago(filters)
  const cierres = useCajaCierres(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reporte de caja</h1>
        <p className="text-sm text-muted-foreground">Ingresos, egresos, metodos de pago y cierres de caja.</p>
      </div>

      <ReporteExportActions grupo="caja" reporte="cierres" filters={filters} filename="reporte-caja" />

      <Card><CardContent className="pt-6"><ReporteFilters filters={filters} onChange={setFilters} showEstado={false} /></CardContent></Card>

      {resumen.isError ? <ReporteError title="No se pudo cargar resumen" error={resumen.error} /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <ReporteMetricCard title="Ingresos" value={resumen.isLoading ? "..." : formatCurrency(resumen.data?.ingresos)} />
        <ReporteMetricCard title="Egresos" value={resumen.isLoading ? "..." : formatCurrency(resumen.data?.egresos)} />
        <ReporteMetricCard title="Saldo" value={resumen.isLoading ? "..." : formatCurrency(resumen.data?.saldo)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Ventas por metodo de pago</CardTitle></CardHeader>
          <CardContent>{metodos.isLoading ? <Skeleton className="h-48" /> : <ReporteTable data={metodos.data?.metodos ?? []} columns={[{ key: "metodo", header: "Metodo", render: (row) => row.metodo_pago || "-" }, { key: "total", header: "Total", className: "text-right", render: (row) => formatCurrency(row.total) }]} />}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Cierres de caja</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {cierres.isLoading ? <Skeleton className="h-48" /> : cierres.isError ? <ReporteError title="No se pudo cargar cierres" error={cierres.error} /> : (
              <>
                <ReporteTable<GenericRecord>
                  data={cierres.data?.data ?? []}
                  columns={[
                    { key: "fecha", header: "Fecha cierre", render: (row) => formatDate(row.fecha_cierre) },
                    { key: "apertura", header: "Apertura", render: (row) => formatCurrency(row.monto_apertura) },
                    { key: "cierre", header: "Cierre", render: (row) => formatCurrency(row.monto_cierre) },
                    { key: "usuario", header: "Usuario", render: (row) => row.user_cierre?.name ?? row.userCierre?.name ?? "-" },
                  ]}
                />
                {cierres.data ? <AppPagination currentPage={cierres.data.meta.current_page} lastPage={cierres.data.meta.last_page} perPage={cierres.data.meta.per_page} total={cierres.data.meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(per_page) => setFilters((current) => ({ ...current, per_page, page: 1 }))} /> : null}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ReporteError({ title, error }: { title: string; error: unknown }) {
  return <Alert variant="destructive"><AlertTitle>{title}</AlertTitle><AlertDescription>{getLaravelErrorMessage(error)}</AlertDescription></Alert>
}
