import { api } from "@/shared/services/api"
import { normalizePaginated, type PaginatedResponse } from "@/modules/configuracion/shared/types"
import type { Permission, Role, RoleFilters, RoleFormValues } from "@/modules/configuracion/roles/types/role.types"
function unwrap<T>(r: T | { data: T }): T { return (r as { data?: T }).data ?? r as T }
export const roleService = {
  async list(filters: RoleFilters): Promise<PaginatedResponse<Role>> { const { data } = await api.get("/roles", { params: filters }); return normalizePaginated<Role>(data) },
  async permissions() { const { data } = await api.get<{ data: Permission[] } | Permission[]>("/permisos"); return unwrap(data) },
  async create(values: RoleFormValues) { const { data } = await api.post<Role | { data: Role }>("/roles", values); return unwrap(data) },
  async update(id: number, values: RoleFormValues) { const { data } = await api.put<Role | { data: Role }>(`/roles/${id}`, values); return unwrap(data) },
  async remove(id: number) { const { data } = await api.delete<{ message: string }>(`/roles/${id}`); return data },
}