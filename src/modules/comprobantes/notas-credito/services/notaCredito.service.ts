import { api } from "@/shared/services/api"
import type { ComprobanteElectronico } from "@/modules/comprobantes/types/comprobante.types"
import type { NotaCreditoFormValues } from "@/modules/comprobantes/notas-credito/schemas/notaCredito.schema"
import type { MotivoNotaCredito, NotaCredito, NotaCreditoFilters, PaginatedResponse, PaginationMeta } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"

type LaravelClassicPaginated<T> = PaginationMeta & { data: T[]; links?: unknown }
type LaravelResourcePaginated<T> = { data: T[]; links?: unknown; meta?: PaginationMeta }

function cleanParams(filters: NotaCreditoFilters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== "" && value !== null))
}

function normalizePaginated<T>(response: LaravelResourcePaginated<T> | LaravelClassicPaginated<T>): PaginatedResponse<T> {
  if ("meta" in response && response.meta) {
    return { data: response.data ?? [], links: response.links, meta: { current_page: Number(response.meta.current_page ?? 1), last_page: Number(response.meta.last_page ?? 1), per_page: Number(response.meta.per_page ?? 15), total: Number(response.meta.total ?? 0) } }
  }
  const classic = response as LaravelClassicPaginated<T>
  return { data: classic.data ?? [], links: classic.links, meta: { current_page: Number(classic.current_page ?? 1), last_page: Number(classic.last_page ?? 1), per_page: Number(classic.per_page ?? 15), total: Number(classic.total ?? 0) } }
}

export const notaCreditoService = {
  async getNotasCredito(filters: NotaCreditoFilters = {}) {
    const { data } = await api.get<LaravelResourcePaginated<NotaCredito> | LaravelClassicPaginated<NotaCredito>>("/notas-credito", { params: cleanParams(filters) })
    return normalizePaginated(data)
  },
  async getNotaCredito(id: number | string) {
    const { data } = await api.get<{ data: NotaCredito } | NotaCredito>(`/notas-credito/${id}`)
    return "data" in data ? data.data : data
  },
  async searchComprobantesAceptados(query = "") {
    const search = query.trim() || undefined
    const params = { tipo_comprobante: "BOLETA,FACTURA", estado_sunat: "ACEPTADO", numero: search, search, per_page: 20 }
    const { data } = await api.get<LaravelResourcePaginated<ComprobanteElectronico> | LaravelClassicPaginated<ComprobanteElectronico>>("/sunat/comprobantes", { params })
    return normalizePaginated(data).data
  },

  async getComprobante(id: number | string) {
    const { data } = await api.get<{ data: ComprobanteElectronico } | ComprobanteElectronico>(`/sunat/comprobantes/${id}`)
    return "data" in data ? data.data : data
  },

  async crearNotaCredito(payload: NotaCreditoFormValues) {
    const { data } = await api.post<{ data: NotaCredito } | { success: boolean; data: NotaCredito } | NotaCredito>("/notas-credito", payload)
    return "data" in data ? data.data : data
  },

  async getMotivosNotaCredito() {
    const { data } = await api.get<{ data: MotivoNotaCredito[] } | MotivoNotaCredito[]>("/motivos-nota-credito")
    return Array.isArray(data) ? data : data.data
  },
}
