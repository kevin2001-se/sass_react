import { api } from "@/shared/services/api"
import type { AnularPagoProveedorPayload, PagoProveedor, PagoProveedorFilters, PagoProveedorFormValues, PagoProveedorResponse, PaginatedResponse } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"

function unwrap<T>(payload: T | { data: T }): T { return (payload as { data?: T }).data ?? payload as T }
function normalizePaginated<T>(response: any): PaginatedResponse<T> {
  if (response?.meta) return response as PaginatedResponse<T>
  return { data: response?.data ?? [], meta: { current_page: response?.current_page ?? 1, last_page: response?.last_page ?? 1, per_page: response?.per_page ?? 15, total: response?.total ?? response?.data?.length ?? 0 } }
}

export const pagoProveedorService = {
  async list(filters: PagoProveedorFilters) {
    const { data } = await api.get("/pagos-proveedor", { params: filters })
    return normalizePaginated<PagoProveedor>(data)
  },
  async get(id: number) {
    const { data } = await api.get<PagoProveedorResponse>(`/pagos-proveedor/${id}`)
    return unwrap<PagoProveedor>(data)
  },
  async create(values: PagoProveedorFormValues) {
    const { data } = await api.post<PagoProveedorResponse>("/pagos-proveedor", values)
    return unwrap<PagoProveedor>(data)
  },
  async anular(id: number, payload: AnularPagoProveedorPayload) {
    const { data } = await api.post<PagoProveedorResponse>(`/pagos-proveedor/${id}/anular`, payload)
    return unwrap<PagoProveedor>(data)
  },
}