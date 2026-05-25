import { api } from "@/shared/services/api"
import { normalizePaginated, type PaginatedResponse } from "@/modules/configuracion/shared/types"
import type { SerieComprobante, SerieFilters, SerieFormValues } from "@/modules/configuracion/series/types/serie.types"
function unwrap<T>(r: T | { data: T }): T { return (r as { data?: T }).data ?? r as T }
export const serieService = {
  async list(filters: SerieFilters): Promise<PaginatedResponse<SerieComprobante>> { const { data } = await api.get("/series-comprobantes", { params: filters }); return normalizePaginated<SerieComprobante>(data) },
  async create(values: SerieFormValues) { const { data } = await api.post<SerieComprobante | { data: SerieComprobante }>("/series-comprobantes", values); return unwrap(data) },
  async update(id: number, values: SerieFormValues) { const { data } = await api.put<SerieComprobante | { data: SerieComprobante }>(`/series-comprobantes/${id}`, values); return unwrap(data) },
  async remove(id: number) { const { data } = await api.delete<{ message: string }>(`/series-comprobantes/${id}`); return data },
}