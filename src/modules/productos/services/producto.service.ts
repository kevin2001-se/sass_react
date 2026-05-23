import { api } from "@/shared/services/api"
import type {
  PaginatedResponse,
  Producto,
  ProductoFilters,
  ProductoPayload,
} from "@/modules/productos/types/producto.types"

type ResourceResponse<T> = { data: T }

function unwrapResource<T>(payload: T | ResourceResponse<T>): T {
  return "data" in (payload as ResourceResponse<T>) ? (payload as ResourceResponse<T>).data : payload as T
}

export const productoService = {
  async getProductos(filters: ProductoFilters = {}) {
    const { data } = await api.get<PaginatedResponse<Producto>>("/productos", {
      params: {
        ...filters,
        categoria_id: filters.categoria_id || undefined,
        estado: filters.estado || undefined,
      },
    })

    return data
  },

  async getProducto(id: number) {
    const { data } = await api.get<Producto | ResourceResponse<Producto>>(`/productos/${id}`)
    return unwrapResource(data)
  },

  async createProducto(payload: ProductoPayload) {
    const { data } = await api.post<Producto | ResourceResponse<Producto>>("/productos", payload)
    return unwrapResource(data)
  },

  async updateProducto(id: number, payload: ProductoPayload) {
    const { data } = await api.put<Producto | ResourceResponse<Producto>>(`/productos/${id}`, payload)
    return unwrapResource(data)
  },

  async deleteProducto(id: number) {
    await api.delete(`/productos/${id}`)
  },
}
