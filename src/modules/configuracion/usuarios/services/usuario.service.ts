import { api } from "@/shared/services/api"
import { normalizePaginated, type PaginatedResponse } from "@/modules/configuracion/shared/types"
import type { Usuario, UsuarioFilters, UsuarioFormValues } from "@/modules/configuracion/usuarios/types/usuario.types"
function unwrap<T>(r: T | { data: T }): T { return (r as { data?: T }).data ?? r as T }
export const usuarioService = {
  async list(filters: UsuarioFilters): Promise<PaginatedResponse<Usuario>> { const { data } = await api.get("/usuarios", { params: filters }); return normalizePaginated<Usuario>(data) },
  async create(values: UsuarioFormValues) { const { data } = await api.post<Usuario | { data: Usuario }>("/usuarios", values); return unwrap(data) },
  async update(id: number, values: UsuarioFormValues) { const { data } = await api.put<Usuario | { data: Usuario }>(`/usuarios/${id}`, values); return unwrap(data) },
  async remove(id: number) { const { data } = await api.delete<{ message: string }>(`/usuarios/${id}`); return data },
}