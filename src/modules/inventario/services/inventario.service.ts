import { api } from "@/shared/services/api"
import type {
  CargaMasivaResponse,
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

  async plantillaCargaMasiva(tipo: "entrada" | "salida" | "ajuste") {
    const { data } = await api.get(`/inventario/${tipo}/carga-masiva/plantilla`, { responseType: "blob" })
    return data as Blob
  },

  async cargaMasiva(tipo: "entrada" | "salida" | "ajuste", payload: { archivo: File; motivo?: string; tipo_ajuste?: "POSITIVO" | "NEGATIVO" }) {
    const formData = new FormData()
    formData.append("archivo", payload.archivo)
    if (payload.motivo) formData.append("motivo", payload.motivo)
    if (payload.tipo_ajuste) formData.append("tipo_ajuste", payload.tipo_ajuste)
    const { data } = await api.post<CargaMasivaResponse>(`/inventario/${tipo}/carga-masiva`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    return data
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
