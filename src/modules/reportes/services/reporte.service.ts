import { api } from "@/shared/services/api"
import type {
  FlujoFinanciero,
  GenericRecord,
  MetodosPagoResponse,
  PaginatedResponse,
  ProductosRankingResponse,
  ReporteFilters,
  ResumenCaja,
  ResumenCompras,
  ResumenVentas,
  StockValorizadoResponse,
} from "@/modules/reportes/types/reporte.types"

function unwrap<T>(payload: T | { data: T }): T {
  return (payload as { data?: T }).data ?? (payload as T)
}

function normalizePaginated<T>(payload: any): PaginatedResponse<T> {
  if (payload?.meta) return payload as PaginatedResponse<T>
  return {
    data: payload?.data ?? [],
    meta: {
      current_page: payload?.current_page ?? 1,
      last_page: payload?.last_page ?? 1,
      per_page: payload?.per_page ?? 15,
      total: payload?.total ?? payload?.data?.length ?? 0,
    },
  }
}

async function getData<T>(url: string, filters: ReporteFilters = {}) {
  const { data } = await api.get(url, { params: filters })
  return unwrap<T>(data)
}


async function downloadReporte(grupo: string, reporte: string, formato: "excel" | "pdf", filters: ReporteFilters = {}) {
  const { data } = await api.get(`/reportes/${grupo}/${reporte}/${formato}`, { params: filters, responseType: "blob" })
  return data as Blob
}
async function getPaginated<T>(url: string, filters: ReporteFilters = {}) {
  const { data } = await api.get(url, { params: filters })
  return normalizePaginated<T>(data)
}

export const reporteService = {
  ventasResumen: (filters: ReporteFilters) => getData<ResumenVentas>("/reportes/ventas/resumen", filters),
  ventasMetodosPago: (filters: ReporteFilters) => getData<MetodosPagoResponse>("/reportes/ventas/metodos-pago", filters),
  ventasProductos: (filters: ReporteFilters) => getData<ProductosRankingResponse>("/reportes/ventas/productos-mas-vendidos", filters),
  ventasDetalle: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/ventas/detalle", filters),

  comprasResumen: (filters: ReporteFilters) => getData<ResumenCompras>("/reportes/compras/resumen", filters),
  comprasProductos: (filters: ReporteFilters) => getData<ProductosRankingResponse>("/reportes/compras/productos-mas-comprados", filters),
  comprasDetalle: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/compras/detalle", filters),

  inventarioStockActual: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/inventario/stock-actual", filters),
  inventarioStockValorizado: (filters: ReporteFilters) => getData<StockValorizadoResponse>("/reportes/inventario/stock-valorizado", filters),
  inventarioBajoStock: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/inventario/bajo-stock", filters),
  inventarioLotesPorVencer: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/inventario/lotes-por-vencer", filters),
  inventarioLotesVencidos: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/inventario/lotes-vencidos", filters),
  inventarioKardex: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/inventario/kardex", filters),

  cajaResumen: (filters: ReporteFilters) => getData<ResumenCaja>("/reportes/caja/resumen", filters),
  cajaMetodosPago: (filters: ReporteFilters) => getData<MetodosPagoResponse>("/reportes/caja/metodos-pago", filters),
  cajaCierres: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/caja/cierres", filters),

  financieroCuentasCobrar: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/financiero/cuentas-por-cobrar", filters),
  financieroCuentasPagar: (filters: ReporteFilters) => getPaginated<GenericRecord>("/reportes/financiero/cuentas-por-pagar", filters),
  financieroFlujo: (filters: ReporteFilters) => getData<FlujoFinanciero>("/reportes/financiero/flujo", filters),

  exportExcel: (grupo: string, reporte: string, filters: ReporteFilters) => downloadReporte(grupo, reporte, "excel", filters),
  exportPdf: (grupo: string, reporte: string, filters: ReporteFilters) => downloadReporte(grupo, reporte, "pdf", filters),
}
