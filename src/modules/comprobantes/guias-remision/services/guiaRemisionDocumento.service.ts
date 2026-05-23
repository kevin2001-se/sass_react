import { api } from "@/shared/services/api"
import type { GuiaRemision } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"

function responseData(response: { data: GuiaRemision } | { success: boolean; data: GuiaRemision } | GuiaRemision) {
  return "data" in response ? response.data : response
}

export const guiaRemisionDocumentoService = {
  async generarPdfA4(id: number) {
    const { data } = await api.post<{ data: GuiaRemision } | { success: boolean; data: GuiaRemision } | GuiaRemision>(`/guias-remision/${id}/generar-pdf-a4`)
    return responseData(data)
  },

  async generarTicket80(id: number) {
    const { data } = await api.post<{ data: GuiaRemision } | { success: boolean; data: GuiaRemision } | GuiaRemision>(`/guias-remision/${id}/generar-ticket-80`)
    return responseData(data)
  },

  async generarFormatos(id: number) {
    const { data } = await api.post<{ data: GuiaRemision } | { success: boolean; data: GuiaRemision } | GuiaRemision>(`/guias-remision/${id}/generar-formatos`)
    return responseData(data)
  },

  async descargarPdfA4(id: number) {
    const { data } = await api.get<Blob>(`/guias-remision/${id}/pdf-a4`, { responseType: "blob" })
    return data
  },

  async descargarTicket80(id: number) {
    const { data } = await api.get<Blob>(`/guias-remision/${id}/ticket-80`, { responseType: "blob" })
    return data
  },
}
