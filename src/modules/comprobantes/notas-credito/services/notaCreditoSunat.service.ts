import { api } from "@/shared/services/api"
import type { NotaCredito } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"

function responseData(response: { data: NotaCredito } | { success: boolean; data: NotaCredito } | NotaCredito) {
  return "data" in response ? response.data : response
}

export const notaCreditoSunatService = {
  async enviarSunat(id: number) {
    const { data } = await api.post<{ data: NotaCredito } | { success: boolean; data: NotaCredito } | NotaCredito>(`/notas-credito/${id}/enviar-sunat`)
    return responseData(data)
  },

  async reenviarSunat(id: number) {
    const { data } = await api.post<{ data: NotaCredito } | { success: boolean; data: NotaCredito } | NotaCredito>(`/notas-credito/${id}/reenviar-sunat`)
    return responseData(data)
  },

  async descargarXml(id: number) {
    const { data } = await api.get<Blob>(`/notas-credito/${id}/xml`, { responseType: "blob" })
    return data
  },

  async descargarCdr(id: number) {
    const { data } = await api.get<Blob>(`/notas-credito/${id}/cdr`, { responseType: "blob" })
    return data
  },
}