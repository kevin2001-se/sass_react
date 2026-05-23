import { api } from "@/shared/services/api"
import type {
  InventarioAjustePayload,
  InventarioEntradaPayload,
  InventarioMovimiento,
  InventarioPaginated,
  InventarioSalidaPayload,
  MovimientoFilters,
  Stock,
  StockFilters,
} from "@/modules/inventario/types/inventario.types"

type ResourceResponse<T> = T | { data: T }

function unwrapResource<T>(payload: ResourceResponse<T>) {
  return "data" in (payload as { data: T }) ? (payload as { data: T }).data : payload as T
}

export const inventarioService = {
  async getStocks(filters: StockFilters = {}) {
    const endpoint = filters.bajo_stock === "true" ? "/stocks/alertas" : "/stocks"
    const { data } = await api.get<InventarioPaginated<Stock>>(endpoint, {
      params: {
        producto_id: filters.producto_id || undefined,
        estado: filters.estado || undefined,
        page: filters.page,
        per_page: filters.per_page ?? 15,
      },
    })
    return data
  },

  async getStockProducto(productoId: number) {
    const { data } = await api.get<InventarioPaginated<Stock>>(`/stocks/producto/${productoId}`)
    return data
  },

  async getMovimientos(filters: MovimientoFilters = {}) {
    const { data } = await api.get<InventarioPaginated<InventarioMovimiento>>("/inventario/movimientos", {
      params: {
        producto_id: filters.producto_id || undefined,
        lote_id: filters.lote_id || undefined,
        tipo_movimiento: filters.tipo_movimiento || undefined,
        page: filters.page,
        per_page: filters.per_page ?? 15,
      },
    })
    return data
  },

  async entrada(payload: InventarioEntradaPayload) {
    const { data } = await api.post<ResourceResponse<InventarioMovimiento>>("/inventario/entrada", payload)
    return unwrapResource(data)
  },

  async salida(payload: InventarioSalidaPayload) {
    const { data } = await api.post<ResourceResponse<InventarioMovimiento>>("/inventario/salida", payload)
    return unwrapResource(data)
  },

  async ajuste(payload: InventarioAjustePayload) {
    const { data } = await api.post<ResourceResponse<InventarioMovimiento>>("/inventario/ajuste", payload)
    return unwrapResource(data)
  },

  async getKardex(productoId: number, filters: MovimientoFilters = {}) {
    const { data } = await api.get<InventarioPaginated<InventarioMovimiento>>(`/inventario/kardex/${productoId}`, {
      params: {
        page: filters.page,
        per_page: filters.per_page ?? 15,
      },
    })
    return data
  },
}
