import { api } from "@/shared/services/api"
import type {
  ProductoConfiguracion,
  ProductoConfiguracionPayload,
} from "@/modules/productos/types/producto.types"

type ResourceResponse<T> = { data: T }

function unwrap<T>(payload: T | ResourceResponse<T>) {
  return "data" in (payload as ResourceResponse<T>) ? (payload as ResourceResponse<T>).data : payload as T
}

export const productoConfiguracionService = {
  async getConfiguracion() {
    const { data } = await api.get<ProductoConfiguracion | ResourceResponse<ProductoConfiguracion>>("/productos/configuracion")
    return unwrap(data)
  },

  async updateConfiguracion(payload: ProductoConfiguracionPayload) {
    const { data } = await api.put<ProductoConfiguracion | ResourceResponse<ProductoConfiguracion>>(
      "/productos/configuracion",
      payload,
    )
    return unwrap(data)
  },
}
