import { api } from "@/shared/services/api"
import type { ActualizarParametrosPayload, ActualizarParametrosResponse, Parametro, ParametroGrupo, ParametrosAgrupados } from "@/modules/configuracion/parametros/types/parametro.types"

function unwrapData<T>(response: T | { data: T }): T {
  return (response as { data?: T }).data ?? (response as T)
}

export const parametroService = {
  async list(): Promise<ParametrosAgrupados> {
    const { data } = await api.get<{ data: ParametrosAgrupados } | ParametrosAgrupados>("/parametros")
    return unwrapData(data)
  },

  async getByGroup(grupo: ParametroGrupo): Promise<Parametro[]> {
    const { data } = await api.get<{ data: Parametro[] } | Parametro[]>(`/parametros/grupo/${grupo}`)
    return unwrapData(data)
  },

  async update(payload: ActualizarParametrosPayload): Promise<ActualizarParametrosResponse> {
    const { data } = await api.put<ActualizarParametrosResponse>("/parametros", payload)
    return data
  },
}