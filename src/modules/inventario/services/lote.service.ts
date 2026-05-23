import { api } from "@/shared/services/api"
import type { InventarioPaginated, Lote, LoteFilters, LotePayload } from "@/modules/inventario/types/inventario.types"

type ResourceResponse<T> = T | { data: T }

function unwrapResource<T>(payload: ResourceResponse<T>) {
  return "data" in (payload as { data: T }) ? (payload as { data: T }).data : payload as T
}

export const loteService = {
  async getLotes(filters: LoteFilters = {}) {
    const { data } = await api.get<InventarioPaginated<Lote>>("/lotes", {
      params: {
        buscar: filters.buscar || undefined,
        producto_id: filters.producto_id || undefined,
        estado: filters.estado || undefined,
        page: filters.page,
        per_page: filters.per_page ?? 15,
      },
    })
    return data
  },

  async getLote(id: number) {
    const { data } = await api.get<ResourceResponse<Lote>>(`/lotes/${id}`)
    return unwrapResource(data)
  },

  async createLote(payload: LotePayload) {
    const { data } = await api.post<ResourceResponse<Lote>>("/lotes", payload)
    return unwrapResource(data)
  },

  async updateLote(id: number, payload: LotePayload) {
    const { data } = await api.put<ResourceResponse<Lote>>(`/lotes/${id}`, payload)
    return unwrapResource(data)
  },

  async deleteLote(id: number) {
    await api.delete(`/lotes/${id}`)
  },
}
