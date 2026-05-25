import { api } from "@/shared/services/api"
import type { AnularCompraPayload, Compra, CompraFilters, CompraPayload, CompraResponse, PaginatedResponse } from "@/modules/compras/compras/types/compra.types"

function unwrap<T>(payload: T | { data: T }): T {
  return (payload as { data?: T }).data ?? payload as T
}

function normalizePaginated<T>(response: any): PaginatedResponse<T> {
  if (response?.meta) return response as PaginatedResponse<T>
  return { data: response?.data ?? [], meta: { current_page: response?.current_page ?? 1, last_page: response?.last_page ?? 1, per_page: response?.per_page ?? 15, total: response?.total ?? response?.data?.length ?? 0 } }
}

export const compraService = {
  async list(filters: CompraFilters) {
    const { data } = await api.get("/compras", { params: filters })
    return normalizePaginated<Compra>(data)
  },
  async registrar(values: CompraPayload) {
    const { data } = await api.post<CompraResponse>("/compras", values)
    return unwrap<Compra>(data)
  },
  async get(id: number) {
    const { data } = await api.get<CompraResponse>(`/compras/${id}`)
    return unwrap<Compra>(data)
  },
  async anular(id: number, payload: AnularCompraPayload) {
    const { data } = await api.post<CompraResponse>(`/compras/${id}/anular`, payload)
    return unwrap<Compra>(data)
  },
  async generarPdf(id: number) {
    const { data } = await api.post<{ data: Compra }>(`/compras/${id}/generar-pdf`)
    return unwrap<Compra>(data)
  },
  async descargarPdf(id: number) {
    const { data } = await api.get(`/compras/${id}/pdf`, { responseType: "blob" })
    return data as Blob
  },
}
