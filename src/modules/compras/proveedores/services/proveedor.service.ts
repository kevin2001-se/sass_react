import { api } from "@/shared/services/api"
import type { PaginatedResponse, Proveedor, ProveedorFilters, ProveedorFormValues } from "@/modules/compras/proveedores/types/proveedor.types"

function normalizePaginated<T>(response: any): PaginatedResponse<T> {
  if (response?.meta) return response as PaginatedResponse<T>
  return { data: response?.data ?? [], meta: { current_page: response?.current_page ?? 1, last_page: response?.last_page ?? 1, per_page: response?.per_page ?? 15, total: response?.total ?? response?.data?.length ?? 0 } }
}
function unwrap<T>(response: T | { data: T }): T { return (response as { data?: T }).data ?? response as T }

export const proveedorService = {
  async list(filters: ProveedorFilters) {
    const { data } = await api.get("/proveedores", { params: filters })
    return normalizePaginated<Proveedor>(data)
  },
  async get(id: number) {
    const { data } = await api.get<Proveedor | { data: Proveedor }>(`/proveedores/${id}`)
    return unwrap(data)
  },
  async create(values: ProveedorFormValues) {
    const { data } = await api.post<Proveedor | { data: Proveedor }>("/proveedores", values)
    return unwrap(data)
  },
  async update(id: number, values: ProveedorFormValues) {
    const { data } = await api.put<Proveedor | { data: Proveedor }>(`/proveedores/${id}`, values)
    return unwrap(data)
  },
  async remove(id: number) {
    const { data } = await api.delete<{ message: string }>(`/proveedores/${id}`)
    return data
  },
}