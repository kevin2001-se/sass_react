import { api } from "@/shared/services/api"
import type { ComunicacionBaja, ComunicacionBajaPayload, PaginatedResponse } from "@/modules/comprobantes/types/comprobante.types"

export const comunicacionBajaService = {
  async getBajas() {
    const { data } = await api.get<PaginatedResponse<ComunicacionBaja>>("/sunat/comunicaciones-baja")
    return data
  },
  async generar(payload: ComunicacionBajaPayload) {
    const { data } = await api.post("/sunat/comunicaciones-baja/generar", payload)
    return data
  },
  async enviar(id: number) {
    const { data } = await api.post(`/sunat/comunicaciones-baja/${id}/enviar`)
    return data
  },
  async consultarTicket(id: number) {
    const { data } = await api.post(`/sunat/comunicaciones-baja/${id}/consultar-ticket`)
    return data
  },
  async reenviar(id: number) {
    const { data } = await api.post(`/sunat/comunicaciones-baja/${id}/reenviar`)
    return data
  },
  async xml(id: number) {
    const { data } = await api.get<Blob>(`/sunat/comunicaciones-baja/${id}/xml`, { responseType: "blob" })
    return data
  },
  async cdr(id: number) {
    const { data } = await api.get<Blob>(`/sunat/comunicaciones-baja/${id}/cdr`, { responseType: "blob" })
    return data
  },
}