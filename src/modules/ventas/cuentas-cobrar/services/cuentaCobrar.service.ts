import { api } from "@/shared/services/api"
import type { CuentaCobrar, CuentaCobrarFilters, PaginatedResponse, RegistrarPagoClientePayload } from "../types/cuentaCobrar.types"

function clean<T extends Record<string, unknown>>(filters: T) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "TODOS"))
}

function unwrap<T>(payload: T | { data: T }): T { return (payload as { data?: T }).data ?? payload as T }
function normalize<T>(payload: any): PaginatedResponse<T> {
  if (payload?.meta) return payload
  return { data: payload?.data ?? [], meta: { current_page: payload?.current_page ?? 1, last_page: payload?.last_page ?? 1, per_page: payload?.per_page ?? 15, total: payload?.total ?? payload?.data?.length ?? 0 } }
}

export const cuentaCobrarService = {
  async list(filters: CuentaCobrarFilters) {
    const { data } = await api.get("/cuentas-por-cobrar", { params: clean(filters as Record<string, unknown>) })
    return normalize<CuentaCobrar>(data)
  },
  async get(id: number | string) {
    const { data } = await api.get(`/cuentas-por-cobrar/${id}`)
    return unwrap<CuentaCobrar>(data)
  },
  async pagar(id: number | string, payload: Omit<RegistrarPagoClientePayload, "cuenta_por_cobrar_id">) {
    const { data } = await api.post(`/cuentas-por-cobrar/${id}/pagar`, payload)
    return unwrap<CuentaCobrar>(data)
  },
}
