import { api } from "@/shared/services/api"
import type { GuiaRemision } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"

function responseData(response: { data: GuiaRemision } | { success: boolean; data: GuiaRemision } | GuiaRemision) {
  return "data" in response ? response.data : response
}

export const guiaRemisionSunatService = {
  async enviarSunat(id: number) {
    const { data } = await api.post<{ data: GuiaRemision } | { success: boolean; data: GuiaRemision } | GuiaRemision>(`/guias-remision/${id}/enviar-sunat`)
    return responseData(data)
  },

  async reenviarSunat(id: number) {
    const { data } = await api.post<{ data: GuiaRemision } | { success: boolean; data: GuiaRemision } | GuiaRemision>(`/guias-remision/${id}/reenviar-sunat`)
    return responseData(data)
  },

  async descargarXml(id: number) {
    const { data } = await api.get<Blob>(`/guias-remision/${id}/xml`, { responseType: "blob" })
    return data
  },

  async descargarCdr(id: number) {
    const { data } = await api.get<Blob>(`/guias-remision/${id}/cdr`, { responseType: "blob" })
    return data
  },
}
