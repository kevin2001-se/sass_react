import { api } from "@/shared/services/api"

export type Departamento = { id: number; codigo: string; nombre: string; estado?: boolean }
export type Provincia = { id: number; departamento_id: number; codigo: string; nombre: string; estado?: boolean }
export type Distrito = {
  id: number
  provincia_id: number
  codigo: string
  nombre: string
  ubigeo: string
  estado?: boolean
  provincia?: { id: number; codigo: string; nombre: string; departamento?: Departamento | null } | null
}

function unwrap<T>(data: { data: T } | T): T {
  return data && typeof data === "object" && "data" in data ? (data as { data: T }).data : data as T
}

export const ubigeoService = {
  async getDepartamentos() {
    const { data } = await api.get<{ data: Departamento[] } | Departamento[]>("/ubigeo/departamentos")
    return unwrap(data)
  },

  async getProvincias(departamentoId?: number | string | null) {
    if (!departamentoId) return []
    const { data } = await api.get<{ data: Provincia[] } | Provincia[]>("/ubigeo/provincias", { params: { departamento_id: departamentoId } })
    return unwrap(data)
  },

  async getDistritos(provinciaId?: number | string | null) {
    if (!provinciaId) return []
    const { data } = await api.get<{ data: Distrito[] } | Distrito[]>("/ubigeo/distritos", { params: { provincia_id: provinciaId } })
    return unwrap(data)
  },

  async buscarDistritos(query: string) {
    const { data } = await api.get<{ data: Distrito[] } | Distrito[]>("/ubigeo/distritos/buscar", { params: { q: query } })
    return unwrap(data)
  },
}
