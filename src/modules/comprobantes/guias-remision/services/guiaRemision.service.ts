import { api } from "@/shared/services/api"
import type { GuiaRemision, GuiaRemisionFilters, GuiaVentaData, PaginatedResponse, PaginationMeta } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import type { GuiaDesdeVentaFormValues, GuiaRemisionFormValues } from "@/modules/comprobantes/guias-remision/schemas/guiaRemision.schema"

type LaravelClassicPaginated<T> = PaginationMeta & {
  data: T[]
  links?: unknown
}

type LaravelResourcePaginated<T> = {
  data: T[]
  links?: unknown
  meta?: PaginationMeta
}

function cleanParams(filters: GuiaRemisionFilters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== "" && value !== null))
}

function normalizePaginated<T>(response: LaravelResourcePaginated<T> | LaravelClassicPaginated<T>): PaginatedResponse<T> {
  if ("meta" in response && response.meta) {
    return {
      data: response.data ?? [],
      links: response.links,
      meta: {
        current_page: Number(response.meta.current_page ?? 1),
        last_page: Number(response.meta.last_page ?? 1),
        per_page: Number(response.meta.per_page ?? 15),
        total: Number(response.meta.total ?? 0),
      },
    }
  }

  const classic = response as LaravelClassicPaginated<T>
  return {
    data: classic.data ?? [],
    links: classic.links,
    meta: {
      current_page: Number(classic.current_page ?? 1),
      last_page: Number(classic.last_page ?? 1),
      per_page: Number(classic.per_page ?? 15),
      total: Number(classic.total ?? 0),
    },
  }
}

export type GuiaCatalogo = { id: number; codigo: string; descripcion: string; estado?: boolean }
export type ProductoOption = { id: number; nombre: string; codigo_interno?: string | null }

export const guiaRemisionService = {
  async getGuiasRemision(filters: GuiaRemisionFilters = {}) {
    const { data } = await api.get<LaravelResourcePaginated<GuiaRemision> | LaravelClassicPaginated<GuiaRemision>>("/guias-remision", {
      params: cleanParams(filters),
    })
    return normalizePaginated(data)
  },

  async crearGuiaManual(payload: GuiaRemisionFormValues) {
    const { data } = await api.post<{ data: GuiaRemision } | { success: boolean; data: GuiaRemision }>("/guias-remision", payload)
    return "data" in data ? data.data : data
  },


  async crearGuiaDesdeVenta(ventaId: number, payload: GuiaDesdeVentaFormValues) {
    const { data } = await api.post<{ data: GuiaRemision } | { success: boolean; data: GuiaRemision }>(`/guias-remision/desde-venta/${ventaId}`, payload)
    return "data" in data ? data.data : data
  },

  async getGuiaVentaData(ventaId: number | string) {
    const { data } = await api.get<{ data: GuiaVentaData } | GuiaVentaData>(`/ventas/${ventaId}/guia-remision-data`)
    return "data" in data ? data.data : data
  },

  async searchVentas(query: string) {
    const params = query.trim() ? { numero_comprobante: query.trim(), per_page: 15 } : { per_page: 15 }
    const { data } = await api.get<LaravelResourcePaginated<import("@/modules/ventas/types/venta.types").Venta> | LaravelClassicPaginated<import("@/modules/ventas/types/venta.types").Venta>>("/ventas", { params })
    return normalizePaginated(data).data
  },
  async anularGuia(id: number, motivo: string) {
    const { data } = await api.post<{ data: GuiaRemision } | { success: boolean; data: GuiaRemision } | GuiaRemision>(`/guias-remision/${id}/anular`, { motivo })
    return "data" in data ? data.data : data
  },

  async registrarGuia(id: number) {
    const { data } = await api.post<{ data: GuiaRemision } | { success: boolean; data: GuiaRemision } | GuiaRemision>(`/guias-remision/${id}/registrar`)
    return "data" in data ? data.data : data
  },

  async getMotivosTraslado() {
    const { data } = await api.get<{ data: GuiaCatalogo[] } | GuiaCatalogo[]>("/motivos-traslado")
    return Array.isArray(data) ? data : data.data
  },

  async getModalidadesTransporte() {
    const { data } = await api.get<{ data: GuiaCatalogo[] } | GuiaCatalogo[]>("/modalidades-transporte")
    return Array.isArray(data) ? data : data.data
  },

  async getUnidadesMedidaSunat() {
    const { data } = await api.get<{ data: GuiaCatalogo[] } | GuiaCatalogo[]>("/unidades-medida-sunat")
    return Array.isArray(data) ? data : data.data
  },

  async searchProductos(query: string) {
    const { data } = await api.get<{ data: ProductoOption[] } | (LaravelResourcePaginated<ProductoOption> | LaravelClassicPaginated<ProductoOption>)>("/productos", { params: { buscar: query.trim(), per_page: 20, estado: true } })
    if (Array.isArray(data)) return data
    return data.data ?? []
  },

  async getGuiaRemision(id: number | string) {
    const { data } = await api.get<{ data: GuiaRemision } | GuiaRemision>(`/guias-remision/${id}`)
    return "data" in data ? data.data : data
  },
}

