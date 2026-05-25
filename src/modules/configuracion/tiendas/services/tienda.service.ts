import { api } from "@/shared/services/api"
import { normalizePaginated, type PaginatedResponse } from "@/modules/configuracion/shared/types"
import type { Tienda, TiendaFilters, TiendaFormValues } from "@/modules/configuracion/tiendas/types/tienda.types"
function unwrap<T>(r: T | { data: T }): T { return (r as { data?: T }).data ?? r as T }
export const tiendaService = {
  async list(filters: TiendaFilters): Promise<PaginatedResponse<Tienda>> { const { data } = await api.get("/tiendas", { params: filters }); return normalizePaginated<Tienda>(data) },
  async get(id: number) { const { data } = await api.get<Tienda | { data: Tienda }>(`/tiendas/${id}`); return unwrap(data) },
  async create(values: TiendaFormValues) { const { data } = await api.post<Tienda | { data: Tienda }>("/tiendas", values); return unwrap(data) },
  async update(id: number, values: TiendaFormValues) { const { data } = await api.put<Tienda | { data: Tienda }>(`/tiendas/${id}`, values); return unwrap(data) },
  async remove(id: number) { const { data } = await api.delete<{ message: string }>(`/tiendas/${id}`); return data },
}