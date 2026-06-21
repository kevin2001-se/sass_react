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
import { useFinancieroCuentasCobrar, useFinancieroCuentasPagar, useFinancieroFlujo } from "@/modules/reportes/hooks/useReportes"
import { formatCurrency, formatDate, type GenericRecord, type ReporteFilters as Filters } from "@/modules/reportes/types/reporte.types"

type TabKey = "cxc" | "cxp"

export function ReporteFinancieroPage() {
  const [tab, setTab] = useState<TabKey>("cxc")
  const [filters, setFilters] = useState<Filters>({ page: 1, per_page: 15 })
  const flujo = useFinancieroFlujo(filters)
  const cxc = useFinancieroCuentasCobrar(filters)
  const cxp = useFinancieroCuentasPagar(filters)
  const paginated = tab === "cxc" ? cxc : cxp

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reporte financiero</h1>
        <p className="text-sm text-muted-foreground">Flujo de caja, cuentas por cobrar y cuentas por pagar.</p>
      </div>

      <ReporteExportActions grupo="financiero" reporte="flujo" filters={filters} filename="reporte-financiero" />

      <Card><CardContent className="pt-6"><ReporteFilters filters={filters} onChange={setFilters} estados={["PENDIENTE", "PARCIAL", "PAGADO", "PAGADA", "VENCIDO", "VENCIDA", "ANULADO", "ANULADA"]} /></CardContent></Card>

      {flujo.isError ? <ReporteError title="No se pudo cargar flujo financiero" error={flujo.error} /> : null}
      <div className="grid gap-4 md:grid-cols-5">
        <ReporteMetricCard title="Ingresos" value={flujo.isLoading ? "..." : formatCurrency(flujo.data?.ingresos)} />
        <ReporteMetricCard title="Egresos" value={flujo.isLoading ? "..." : formatCurrency(flujo.data?.egresos)} />
        <ReporteMetricCard title="Saldo" value={flujo.isLoading ? "..." : formatCurrency(flujo.data?.saldo)} />
        <ReporteMetricCard title="CxC pendiente" value={flujo.isLoading ? "..." : formatCurrency(flujo.data?.cuentas_por_cobrar_pendiente)} />
        <ReporteMetricCard title="CxP pendiente" value={flujo.isLoading ? "..." : formatCurrency(flujo.data?.cuentas_por_pagar_pendiente)} />
      </div>

      <Tabs value={tab} onValueChange={(value) => { setTab(value as TabKey); setFilters((current) => ({ ...current, page: 1 })) }}>
        <TabsList>
          <TabsTrigger value="cxc">Cuentas por cobrar</TabsTrigger>
          <TabsTrigger value="cxp">Cuentas por pagar</TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          <Card>
            <CardHeader><CardTitle className="text-base">{tab === "cxc" ? "Cuentas por cobrar" : "Cuentas por pagar"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {paginated.isLoading ? <Skeleton className="h-80" /> : paginated.isError ? <ReporteError title="No se pudo cargar cuentas" error={paginated.error} /> : (
                <>
                  <ReporteTable<GenericRecord>
                    data={paginated.data?.data ?? []}
                    columns={[
                      { key: "persona", header: tab === "cxc" ? "Cliente" : "Proveedor", render: (row) => tab === "cxc" ? row.cliente?.razon_social ?? row.cliente?.nombres ?? "Cliente" : row.proveedor?.razon_social ?? "Proveedor" },
                      { key: "emision", header: "Emision", render: (row) => formatDate(row.fecha_emision) },
                      { key: "vencimiento", header: "Vencimiento", render: (row) => formatDate(row.fecha_vencimiento) },
                      { key: "total", header: "Total", className: "text-right", render: (row) => formatCurrency(row.monto_total) },
                      { key: "pagado", header: "Pagado", className: "text-right", render: (row) => formatCurrency(row.monto_pagado) },
                      { key: "saldo", header: "Saldo", className: "text-right", render: (row) => formatCurrency(row.saldo ?? row.saldo_pendiente) },
                      { key: "estado", header: "Estado", render: (row) => row.estado ?? "-" },
                    ]}
                  />
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

function ReporteError({ title, error }: { title: string; error: unknown }) {
  return <Alert variant="destructive"><AlertTitle>{title}</AlertTitle><AlertDescription>{getLaravelErrorMessage(error)}</AlertDescription></Alert>
}
