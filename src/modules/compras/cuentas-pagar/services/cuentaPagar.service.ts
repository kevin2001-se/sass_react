import { api } from "@/shared/services/api"
import type { CuentaPagar, CuentaPagarFilters, CuentaPagarResponse, PaginatedResponse } from "@/modules/compras/cuentas-pagar/types/cuentaPagar.types"

function unwrap<T>(payload: T | { data: T }): T {
  return (payload as { data?: T }).data ?? payload as T
}

function normalizePaginated<T>(response: any): PaginatedResponse<T> {
  if (response?.meta) return response as PaginatedResponse<T>
  return { data: response?.data ?? [], meta: { current_page: response?.current_page ?? 1, last_page: response?.last_page ?? 1, per_page: response?.per_page ?? 15, total: response?.total ?? response?.data?.length ?? 0 } }
}

export const cuentaPagarService = {
  async list(filters: CuentaPagarFilters) {
    const { data } = await api.get("/cuentas-por-pagar", { params: filters })
    return normalizePaginated<CuentaPagar>(data)
  },
  async get(id: number) {
    const { data } = await api.get<CuentaPagarResponse>(`/cuentas-por-pagar/${id}`)
    return unwrap<CuentaPagar>(data)
  },
}