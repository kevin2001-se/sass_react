import { api } from "@/shared/services/api"
import type { PaginatedResponse, PaginationMeta, Venta, VentaFilters } from "@/modules/ventas/types/venta.types"

type LaravelClassicPaginated<T> = PaginationMeta & {
  data: T[]
  links?: unknown
}

type LaravelResourcePaginated<T> = {
  data: T[]
  links?: unknown
  meta?: PaginationMeta
}

function normalizePaginated<T>(response: LaravelResourcePaginated<T> | LaravelClassicPaginated<T>): PaginatedResponse<T> {
  if ("meta" in response && response.meta) {
    return {
      data: response.data,
      links: response.links,
      meta: response.meta,
    }
  }

  const classic = response as LaravelClassicPaginated<T>

  return {
    data: classic.data,
    links: classic.links,
    meta: {
      current_page: classic.current_page,
      last_page: classic.last_page,
      per_page: Number(classic.per_page),
      total: classic.total,
    },
  }
}

export const ventaService = {
  async getVentas(filters: VentaFilters = {}) {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ""))
    const { data } = await api.get<LaravelResourcePaginated<Venta> | LaravelClassicPaginated<Venta>>("/ventas", { params })
    return normalizePaginated(data)
  },

  async getVenta(id: number) {
    const { data } = await api.get<{ data: Venta } | Venta>(`/ventas/${id}`)
    return "data" in data ? data.data : data
  },
}