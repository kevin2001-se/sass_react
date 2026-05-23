import { api } from "@/shared/services/api"
import type { PaginatedResponse, ResumenDiario, ResumenDiarioPayload } from "@/modules/comprobantes/types/comprobante.types"

export const resumenDiarioService = {
  async getResumenes() {
    const { data } = await api.get<PaginatedResponse<ResumenDiario>>("/sunat/resumenes-diarios")
    return data
  },
  async generar(payload: ResumenDiarioPayload) {
    const { data } = await api.post("/sunat/resumenes-diarios/generar", payload)
    return data
  },
  async enviar(id: number) {
    const { data } = await api.post(`/sunat/resumenes-diarios/${id}/enviar`)
    return data
  },
  async consultarTicket(id: number) {
    const { data } = await api.post(`/sunat/resumenes-diarios/${id}/consultar-ticket`)
    return data
  },
  async reenviar(id: number) {
    const { data } = await api.post(`/sunat/resumenes-diarios/${id}/reenviar`)
    return data
  },
  async xml(id: number) {
    const { data } = await api.get<Blob>(`/sunat/resumenes-diarios/${id}/xml`, { responseType: "blob" })
    return data
  },
  async cdr(id: number) {
    const { data } = await api.get<Blob>(`/sunat/resumenes-diarios/${id}/cdr`, { responseType: "blob" })
    return data
  },
}