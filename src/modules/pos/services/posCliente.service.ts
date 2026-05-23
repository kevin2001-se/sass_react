import { api } from "@/shared/services/api"
import type { PosCliente, PosClientePayload, PosClienteSearchResponse } from "@/modules/pos/types/posCliente.types"

type ResourceResponse<T> = { data: T }

function unwrapResource<T>(payload: T | ResourceResponse<T>): T {
  return "data" in (payload as ResourceResponse<T>) ? (payload as ResourceResponse<T>).data : payload as T
}

export const posClienteService = {
  async buscar(q: string) {
    const { data } = await api.get<PosClienteSearchResponse>("/pos/clientes/buscar", { params: { q } })
    return data.data
  },

  async crear(payload: PosClientePayload) {
    const { data } = await api.post<PosCliente | ResourceResponse<PosCliente>>("/clientes", payload)
    return unwrapResource(data)
  },

  async actualizar(id: number, payload: PosClientePayload) {
    const { data } = await api.put<PosCliente | ResourceResponse<PosCliente>>(`/clientes/${id}`, payload)
    return unwrapResource(data)
  },
}
