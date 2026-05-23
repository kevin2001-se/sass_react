import { api } from "@/shared/services/api"
import type {
  CatalogoConfig,
  CatalogoFilters,
  CatalogoItem,
  CatalogoPayload,
  PaginatedCatalogoResponse,
} from "@/modules/catalogos/types/catalogo.types"

type ResourceResponse<T> = { data: T }

function unwrap<T>(payload: T | ResourceResponse<T>) {
  return "data" in (payload as ResourceResponse<T>) ? (payload as ResourceResponse<T>).data : payload as T
}

export function normalizeCatalogoItem(item: CatalogoItem, isUnidadMedida?: boolean): CatalogoItem {
  if (!isUnidadMedida) {
    return item
  }

  return {
    ...item,
    codigo: item.codigo ?? item.abreviatura ?? "",
    simbolo: item.simbolo ?? item.abreviatura ?? "",
  }
}

export const catalogosService = {
  async list(config: CatalogoConfig, filters: CatalogoFilters = {}) {
    const { data } = await api.get<PaginatedCatalogoResponse>(config.endpoint, {
      params: {
        ...filters,
        estado: filters.estado || undefined,
      },
    })

    return {
      ...data,
      data: data.data.map((item) => normalizeCatalogoItem(item, config.isUnidadMedida)),
    }
  },

  async create(config: CatalogoConfig, payload: CatalogoPayload) {
    const { data } = await api.post<CatalogoItem | ResourceResponse<CatalogoItem>>(config.endpoint, payload)
    return normalizeCatalogoItem(unwrap(data), config.isUnidadMedida)
  },

  async update(config: CatalogoConfig, id: number, payload: CatalogoPayload) {
    const { data } = await api.put<CatalogoItem | ResourceResponse<CatalogoItem>>(`${config.endpoint}/${id}`, payload)
    return normalizeCatalogoItem(unwrap(data), config.isUnidadMedida)
  },

  async delete(config: CatalogoConfig, id: number) {
    await api.delete(`${config.endpoint}/${id}`)
  },
}
