import { useQuery } from "@tanstack/react-query"
import { reporteService } from "@/modules/reportes/services/reporte.service"
import type { ReporteFilters } from "@/modules/reportes/types/reporte.types"

export function useVentasResumen(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "ventas-resumen", filters], queryFn: () => reporteService.ventasResumen(filters) })
}

export function useVentasMetodosPago(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "ventas-metodos-pago", filters], queryFn: () => reporteService.ventasMetodosPago(filters) })
}

export function useVentasProductos(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "ventas-productos", filters], queryFn: () => reporteService.ventasProductos(filters) })
}

export function useVentasDetalle(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "ventas-detalle", filters], queryFn: () => reporteService.ventasDetalle(filters) })
}

export function useComprasResumen(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "compras-resumen", filters], queryFn: () => reporteService.comprasResumen(filters) })
}

export function useComprasProductos(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "compras-productos", filters], queryFn: () => reporteService.comprasProductos(filters) })
}

export function useComprasDetalle(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "compras-detalle", filters], queryFn: () => reporteService.comprasDetalle(filters) })
}

export function useStockActual(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "stock-actual", filters], queryFn: () => reporteService.inventarioStockActual(filters) })
}

export function useStockValorizado(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "stock-valorizado", filters], queryFn: () => reporteService.inventarioStockValorizado(filters) })
}

export function useBajoStock(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "bajo-stock", filters], queryFn: () => reporteService.inventarioBajoStock(filters) })
}

export function useLotesPorVencer(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "lotes-por-vencer", filters], queryFn: () => reporteService.inventarioLotesPorVencer(filters) })
}

export function useLotesVencidos(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "lotes-vencidos", filters], queryFn: () => reporteService.inventarioLotesVencidos(filters) })
}

export function useKardexReporte(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "kardex", filters], queryFn: () => reporteService.inventarioKardex(filters) })
}

export function useCajaResumen(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "caja-resumen", filters], queryFn: () => reporteService.cajaResumen(filters) })
}

export function useCajaMetodosPago(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "caja-metodos-pago", filters], queryFn: () => reporteService.cajaMetodosPago(filters) })
}

export function useCajaCierres(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "caja-cierres", filters], queryFn: () => reporteService.cajaCierres(filters) })
}

export function useFinancieroFlujo(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "financiero-flujo", filters], queryFn: () => reporteService.financieroFlujo(filters) })
}

export function useFinancieroCuentasCobrar(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "financiero-cxc", filters], queryFn: () => reporteService.financieroCuentasCobrar(filters) })
}

export function useFinancieroCuentasPagar(filters: ReporteFilters) {
  return useQuery({ queryKey: ["reportes", "financiero-cxp", filters], queryFn: () => reporteService.financieroCuentasPagar(filters) })
}
