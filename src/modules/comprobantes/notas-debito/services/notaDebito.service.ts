import { api } from "@/shared/services/api"
import type { ComprobanteElectronico } from "@/modules/comprobantes/types/comprobante.types"
import type { NotaDebitoFormValues } from "@/modules/comprobantes/notas-debito/schemas/notaDebito.schema"
import type { MotivoNotaDebito, NotaDebito, NotaDebitoFilters, PaginatedResponse, PaginationMeta } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"

type LaravelClassicPaginated<T> = PaginationMeta & { data: T[]; links?: unknown }
type LaravelResourcePaginated<T> = { data: T[]; links?: unknown; meta?: PaginationMeta }

function cleanParams(filters: NotaDebitoFilters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== "" && value !== null))
}

function normalizePaginated<T>(response: LaravelResourcePaginated<T> | LaravelClassicPaginated<T>): PaginatedResponse<T> {
  if ("meta" in response && response.meta) {
    return { data: response.data ?? [], links: response.links, meta: { current_page: Number(response.meta.current_page ?? 1), last_page: Number(response.meta.last_page ?? 1), per_page: Number(response.meta.per_page ?? 15), total: Number(response.meta.total ?? 0) } }
  }
  const classic = response as LaravelClassicPaginated<T>
  return { data: classic.data ?? [], links: classic.links, meta: { current_page: Number(classic.current_page ?? 1), last_page: Number(classic.last_page ?? 1), per_page: Number(classic.per_page ?? 15), total: Number(classic.total ?? 0) } }
}

export const notaDebitoService = {
  async getNotasDebito(filters: NotaDebitoFilters = {}) {
    const { data } = await api.get<LaravelResourcePaginated<NotaDebito> | LaravelClassicPaginated<NotaDebito>>("/notas-debito", { params: cleanParams(filters) })
    return normalizePaginated(data)
  },

  async getNotaDebito(id: number | string) {
    const { data } = await api.get<{ data: NotaDebito } | NotaDebito>(`/notas-debito/${id}`)
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

  async crearNotaDebito(payload: NotaDebitoFormValues) {
    const { data } = await api.post<{ data: NotaDebito } | { success: boolean; data: NotaDebito } | NotaDebito>("/notas-debito", payload)
    return "data" in data ? data.data : data
  },

  async getMotivosNotaDebito() {
    const { data } = await api.get<{ data: MotivoNotaDebito[] } | MotivoNotaDebito[]>("/motivos-nota-debito")
    return Array.isArray(data) ? data : data.data
  },
}