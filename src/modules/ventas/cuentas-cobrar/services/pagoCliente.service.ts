import { api } from "@/shared/services/api"
import type { AnularPagoClientePayload, PaginatedResponse, PagoCliente, PagoClienteFilters, RegistrarPagoClientePayload } from "../types/cuentaCobrar.types"

function clean<T extends Record<string, unknown>>(filters: T) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "TODOS"))
}
function unwrap<T>(payload: T | { data: T }): T { return (payload as { data?: T }).data ?? payload as T }
function normalize<T>(payload: any): PaginatedResponse<T> {
  if (payload?.meta) return payload
  return { data: payload?.data ?? [], meta: { current_page: payload?.current_page ?? 1, last_page: payload?.last_page ?? 1, per_page: payload?.per_page ?? 15, total: payload?.total ?? payload?.data?.length ?? 0 } }
}

export const pagoClienteService = {
  async list(filters: PagoClienteFilters) {
    const { data } = await api.get("/pagos-cliente", { params: clean(filters as Record<string, unknown>) })
    return normalize<PagoCliente>(data)
  },
  async registrar(payload: RegistrarPagoClientePayload) {
    const { data } = await api.post("/pagos-cliente", payload)
    return unwrap<PagoCliente>(data)
  },
  async anular(id: number | string, payload: AnularPagoClientePayload) {
    const { data } = await api.post(`/pagos-cliente/${id}/anular`, payload)
    return unwrap<PagoCliente>(data)
  },
}
