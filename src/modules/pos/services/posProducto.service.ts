import { api } from "@/shared/services/api"
import type { PosProductSearchResponse } from "@/modules/pos/types/posProducto.types"

export const posProductoService = {
  async rapidos(signal?: AbortSignal) {
    const { data } = await api.get<PosProductSearchResponse>("/pos/productos/rapidos", { signal })
    return data.data
  },
  async buscar(q: string, signal?: AbortSignal) {
    const { data } = await api.get<PosProductSearchResponse>("/pos/productos/buscar", {
      params: { q },
      signal,
    })
    return data.data
  },
}




