import { api } from "@/shared/services/api"
import type { AfectacionIgv } from "@/modules/productos/types/producto.types"

type CollectionResponse<T> = T[] | { data: T[] }

function unwrapCollection<T>(payload: CollectionResponse<T>) {
  return Array.isArray(payload) ? payload : payload.data
}

export const afectacionIgvService = {
  async getAfectaciones() {
    const { data } = await api.get<CollectionResponse<AfectacionIgv>>("/afectaciones-igv")
    return unwrapCollection(data)
  },
}
