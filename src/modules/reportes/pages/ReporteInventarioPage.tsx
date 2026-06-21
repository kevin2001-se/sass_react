import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { AppPagination } from "@/shared/components/table/AppPagination"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { ReporteExportActions } from "@/modules/reportes/components/ReporteExportActions"
import { ReporteFilters } from "@/modules/reportes/components/ReporteFilters"
import { ReporteMetricCard } from "@/modules/reportes/components/ReporteMetricCard"
import { ReporteTable } from "@/modules/reportes/components/ReporteTable"
import { useBajoStock, useKardexReporte, useLotesPorVencer, useLotesVencidos, useStockActual, useStockValorizado } from "@/modules/reportes/hooks/useReportes"
import { formatCurrency, formatDate, toNumber, type GenericRecord, type ReporteFilters as Filters } from "@/modules/reportes/types/reporte.types"

type TabKey = "stock" | "bajo" | "vencer" | "vencidos" | "kardex"

export function ReporteInventarioPage() {
  const [tab, setTab] = useState<TabKey>("stock")
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const stock = useStockActual(filters)
  const valorizado = useStockValorizado(filters)
  const bajo = useBajoStock(filters)
  const porVencer = useLotesPorVencer(filters)
  const vencidos = useLotesVencidos(filters)
  const kardex = useKardexReporte(filters)

  const paginated = tab === "stock" ? stock : tab === "bajo" ? bajo : tab === "vencer" ? porVencer : tab === "vencidos" ? vencidos : kardex
  const exportReport = tab === "stock" ? "stock-actual" : tab === "bajo" ? "bajo-stock" : tab === "vencer" ? "lotes-por-vencer" : tab === "vencidos" ? "lotes-vencidos" : "kardex"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reporte de inventario</h1>
        <p className="text-sm text-muted-foreground">Stock, valorizacion, alertas de bajo stock, lotes y kardex.</p>
      </div>

      <ReporteExportActions grupo="inventario" reporte={exportReport} filters={filters} filename={`reporte-inventario-${exportReport}`} />

      <Card><CardContent className="pt-6"><ReporteFilters filters={filters} onChange={setFilters} showEstado={false} /></CardContent></Card>

      {valorizado.isError ? <ReporteError title="No se pudo cargar valorizacion" error={valorizado.error} /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <ReporteMetricCard title="Stock valorizado" value={valorizado.isLoading ? "..." : formatCurrency(valorizado.data?.total_valorizado)} />
        <ReporteMetricCard title="Items valorizados" value={valorizado.isLoading ? "..." : valorizado.data?.items?.length ?? 0} />
        <ReporteMetricCard title="Alcance" value="Tienda activa" description="Los lotes se filtran por stock disponible en tienda." />
      </div>

      <Tabs value={tab} onValueChange={(value) => { setTab(value as TabKey); setFilters((current) => ({ ...current, page: 1 })) }}>
        <TabsList className="flex w-full flex-wrap justify-start">
          <TabsTrigger value="stock">Stock actual</TabsTrigger>
          <TabsTrigger value="bajo">Bajo stock</TabsTrigger>
          <TabsTrigger value="vencer">Por vencer</TabsTrigger>
          <TabsTrigger value="vencidos">Vencidos</TabsTrigger>
          <TabsTrigger value="kardex">Kardex</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <Card>
            <CardHeader><CardTitle className="text-base">{tabTitle(tab)}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {paginated.isLoading ? <Skeleton className="h-80" /> : paginated.isError ? <ReporteError title="No se pudo cargar reporte" error={paginated.error} /> : (
                <>
                  <ReporteTable<GenericRecord> data={paginated.data?.data ?? []} columns={columnsFor(tab)} />
                  {paginated.data ? <AppPagination currentPage={paginated.data.meta.current_page} lastPage={paginated.data.meta.last_page} perPage={paginated.data.meta.per_page} total={paginated.data.meta.total} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} onPerPageChange={(per_page) => setFilters((current) => ({ ...current, per_page, page: 1 }))} /> : null}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function tabTitle(tab: TabKey) {
  return ({ stock: "Stock actual", bajo: "Productos bajo stock", vencer: "Lotes por vencer", vencidos: "Lotes vencidos", kardex: "Kardex" })[tab]
}

function columnsFor(tab: TabKey) {
  if (tab === "kardex") {
    return [
      { key: "fecha", header: "Fecha", render: (row: GenericRecord) => formatDate(row.created_at) },
      { key: "producto", header: "Producto", render: (row: GenericRecord) => row.producto?.nombre ?? "-" },
      { key: "tipo", header: "Movimiento", render: (row: GenericRecord) => row.tipo_movimiento ?? "-" },
      { key: "cantidad", header: "Cantidad", className: "text-right", render: (row: GenericRecord) => toNumber(row.cantidad).toFixed(2) },
      { key: "usuario", header: "Usuario", render: (row: GenericRecord) => row.user?.name ?? "-" },
    ]
  }
  if (tab === "vencer" || tab === "vencidos") {
    return [
      { key: "lote", header: "Lote", render: (row: GenericRecord) => row.codigo_lote ?? "-" },
      { key: "producto", header: "Producto", render: (row: GenericRecord) => row.producto?.nombre ?? "-" },
      { key: "vencimiento", header: "Vencimiento", render: (row: GenericRecord) => formatDate(row.fecha_vencimiento) },
      { key: "estado", header: "Estado", render: (row: GenericRecord) => row.estado ?? "-" },
    ]
  }
  return [
    { key: "producto", header: "Producto", render: (row: GenericRecord) => row.producto?.nombre ?? "-" },
    { key: "lote", header: "Lote", render: (row: GenericRecord) => row.lote?.codigo_lote ?? "Sin lote" },
    { key: "actual", header: "Actual", className: "text-right", render: (row: GenericRecord) => toNumber(row.cantidad_actual).toFixed(2) },
    { key: "minimo", header: "Minimo", className: "text-right", render: (row: GenericRecord) => row.cantidad_minima ?? "-" },
    { key: "estado", header: "Estado", render: (row: GenericRecord) => row.estado ?? "-" },
  ]
}

function ReporteError({ title, error }: { title: string; error: unknown }) {
  return <Alert variant="destructive"><AlertTitle>{title}</AlertTitle><AlertDescription>{getLaravelErrorMessage(error)}</AlertDescription></Alert>
}
