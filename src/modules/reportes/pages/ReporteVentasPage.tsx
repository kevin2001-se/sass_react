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
import { useVentasDetalle, useVentasMetodosPago, useVentasProductos, useVentasResumen } from "@/modules/reportes/hooks/useReportes"
import { formatCurrency, formatDate, toNumber, type GenericRecord, type ReporteFilters as Filters } from "@/modules/reportes/types/reporte.types"

export function ReporteVentasPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const resumen = useVentasResumen(filters)
  const metodos = useVentasMetodosPago(filters)
  const productos = useVentasProductos(filters)
  const detalle = useVentasDetalle(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reporte de ventas</h1>
        <p className="text-sm text-muted-foreground">Resumen comercial, metodos de pago, productos y detalle de ventas.</p>
      </div>

      <ReporteExportActions grupo="ventas" reporte="detalle" filters={filters} filename="reporte-ventas" />

      <Card><CardContent className="pt-6"><ReporteFilters filters={filters} onChange={setFilters} /></CardContent></Card>

      {resumen.isError ? <ReporteError title="No se pudo cargar resumen" error={resumen.error} /> : null}
      <div className="grid gap-4 md:grid-cols-4">
        <ReporteMetricCard title="Ventas" value={resumen.isLoading ? "..." : resumen.data?.cantidad_ventas ?? 0} />
        <ReporteMetricCard title="Total vendido" value={resumen.isLoading ? "..." : formatCurrency(resumen.data?.total_vendido)} />
        <ReporteMetricCard title="IGV" value={resumen.isLoading ? "..." : formatCurrency(resumen.data?.total_igv)} />
        <ReporteMetricCard title="Descuento" value={resumen.isLoading ? "..." : formatCurrency(resumen.data?.total_descuento)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Metodos de pago</CardTitle></CardHeader>
          <CardContent>{metodos.isLoading ? <Skeleton className="h-48" /> : <ReporteTable data={metodos.data?.metodos ?? []} columns={[{ key: "metodo", header: "Metodo", render: (row) => row.metodo_pago || "-" }, { key: "total", header: "Total", className: "text-right", render: (row) => formatCurrency(row.total) }]} />}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Productos mas vendidos</CardTitle></CardHeader>
          <CardContent>{productos.isLoading ? <Skeleton className="h-48" /> : <ReporteTable data={productos.data?.productos ?? []} columns={[{ key: "producto", header: "Producto", render: (row) => row.producto }, { key: "cantidad", header: "Cantidad", className: "text-right", render: (row) => toNumber(row.cantidad_base).toFixed(2) }, { key: "total", header: "Total", className: "text-right", render: (row) => formatCurrency(row.total_vendido) }]} />}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Detalle de ventas</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {detalle.isLoading ? <Skeleton className="h-80" /> : detalle.isError ? <ReporteError title="No se pudo cargar detalle" error={detalle.error} /> : (
            <>
              <ReporteTable<GenericRecord>
                data={detalle.data?.data ?? []}
                columns={[
                  { key: "fecha", header: "Fecha", render: (row) => formatDate(row.fecha_emision) },
                  { key: "numero", header: "Documento", render: (row) => row.numero_comprobante ?? row.numero ?? `${row.tipo_comprobante ?? ""} ${row.id ?? ""}` },
                  { key: "cliente", header: "Cliente", render: (row) => row.cliente?.razon_social ?? row.cliente?.nombres ?? "Cliente" },
                  { key: "estado", header: "Estado", render: (row) => row.estado ?? "-" },
                  { key: "total", header: "Total", className: "text-right", render: (row) => formatCurrency(row.total) },
                ]}
              />
              {detalle.data ? <AppPagination currentPage={detalle.data.meta.current_page} lastPage={detalle.data.meta.last_page} perPage={detalle.data.meta.per_page} total={detalle.data.meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(per_page) => setFilters((current) => ({ ...current, per_page, page: 1 }))} /> : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ReporteError({ title, error }: { title: string; error: unknown }) {
  return <Alert variant="destructive"><AlertTitle>{title}</AlertTitle><AlertDescription>{getLaravelErrorMessage(error)}</AlertDescription></Alert>
}
