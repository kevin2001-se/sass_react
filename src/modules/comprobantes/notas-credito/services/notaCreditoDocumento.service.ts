import { api } from "@/shared/services/api"
import type { NotaCredito } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"

function responseData(response: { data: NotaCredito } | { success: boolean; data: NotaCredito } | NotaCredito) {
  return "data" in response ? response.data : response
}

export const notaCreditoDocumentoService = {
  async generarPdfA4(id: number) {
    const { data } = await api.post<{ data: NotaCredito } | { success: boolean; data: NotaCredito } | NotaCredito>(`/notas-credito/${id}/generar-pdf-a4`)
    return responseData(data)
  },

  async generarTicket80(id: number) {
    const { data } = await api.post<{ data: NotaCredito } | { success: boolean; data: NotaCredito } | NotaCredito>(`/notas-credito/${id}/generar-ticket-80`)
    return responseData(data)
  },

  async generarFormatos(id: number) {
    const { data } = await api.post<{ data: NotaCredito } | { success: boolean; data: NotaCredito } | NotaCredito>(`/notas-credito/${id}/generar-formatos`)
    return responseData(data)
  },

  async descargarPdfA4(id: number) {
    const { data } = await api.get<Blob>(`/notas-credito/${id}/pdf-a4`, { responseType: "blob" })
    return data
  },

  async descargarTicket80(id: number) {
    const { data } = await api.get<Blob>(`/notas-credito/${id}/ticket-80`, { responseType: "blob" })
    return data
  },
}