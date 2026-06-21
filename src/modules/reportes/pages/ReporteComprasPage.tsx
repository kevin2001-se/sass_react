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
import { useComprasDetalle, useComprasProductos, useComprasResumen } from "@/modules/reportes/hooks/useReportes"
import { formatCurrency, formatDate, toNumber, type GenericRecord, type ReporteFilters as Filters } from "@/modules/reportes/types/reporte.types"

export function ReporteComprasPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const resumen = useComprasResumen(filters)
  const productos = useComprasProductos(filters)
  const detalle = useComprasDetalle(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reporte de compras</h1>
        <p className="text-sm text-muted-foreground">Resumen de compras, productos mas comprados y detalle de documentos.</p>
      </div>

      <ReporteExportActions grupo="compras" reporte="detalle" filters={filters} filename="reporte-compras" />

      <Card><CardContent className="pt-6"><ReporteFilters filters={filters} onChange={setFilters} /></CardContent></Card>

      {resumen.isError ? <ReporteError title="No se pudo cargar resumen" error={resumen.error} /> : null}
      <div className="grid gap-4 md:grid-cols-4">
        <ReporteMetricCard title="Compras" value={resumen.isLoading ? "..." : resumen.data?.cantidad_compras ?? 0} />
        <ReporteMetricCard title="Total comprado" value={resumen.isLoading ? "..." : formatCurrency(resumen.data?.total_comprado)} />
        <ReporteMetricCard title="IGV" value={resumen.isLoading ? "..." : formatCurrency(resumen.data?.total_igv)} />
        <ReporteMetricCard title="Descuento" value={resumen.isLoading ? "..." : formatCurrency(resumen.data?.total_descuento)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Productos mas comprados</CardTitle></CardHeader>
        <CardContent>{productos.isLoading ? <Skeleton className="h-56" /> : <ReporteTable data={productos.data?.productos ?? []} columns={[{ key: "producto", header: "Producto", render: (row) => row.producto }, { key: "cantidad", header: "Cantidad", className: "text-right", render: (row) => toNumber(row.cantidad_base).toFixed(2) }, { key: "total", header: "Total", className: "text-right", render: (row) => formatCurrency(row.total_comprado) }]} />}</CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Detalle de compras</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {detalle.isLoading ? <Skeleton className="h-80" /> : detalle.isError ? <ReporteError title="No se pudo cargar detalle" error={detalle.error} /> : (
            <>
              <ReporteTable<GenericRecord>
                data={detalle.data?.data ?? []}
                columns={[
                  { key: "fecha", header: "Fecha", render: (row) => formatDate(row.fecha_emision) },
                  { key: "documento", header: "Documento", render: (row) => row.numero_documento ?? ([row.serie, row.correlativo].filter(Boolean).join("-") || "-") },
                  { key: "proveedor", header: "Proveedor", render: (row) => row.proveedor?.razon_social ?? row.proveedor?.nombre_comercial ?? "Proveedor" },
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
