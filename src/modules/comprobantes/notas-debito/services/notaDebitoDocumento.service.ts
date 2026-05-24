import { api } from "@/shared/services/api"
import type { NotaDebito } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"

function responseData(response: { data: NotaDebito } | { success: boolean; data: NotaDebito } | NotaDebito) {
  return "data" in response ? response.data : response
}

export const notaDebitoDocumentoService = {
  async generarPdfA4(id: number) {
    const { data } = await api.post<{ data: NotaDebito } | { success: boolean; data: NotaDebito } | NotaDebito>(`/notas-debito/${id}/generar-pdf-a4`)
    return responseData(data)
  },

  async generarTicket80(id: number) {
    const { data } = await api.post<{ data: NotaDebito } | { success: boolean; data: NotaDebito } | NotaDebito>(`/notas-debito/${id}/generar-ticket-80`)
    return responseData(data)
  },

  async generarFormatos(id: number) {
    const { data } = await api.post<{ data: NotaDebito } | { success: boolean; data: NotaDebito } | NotaDebito>(`/notas-debito/${id}/generar-formatos`)
    return responseData(data)
  },

  async descargarPdfA4(id: number) {
    const { data } = await api.get<Blob>(`/notas-debito/${id}/pdf-a4`, { responseType: "blob" })
    return data
  },

  async descargarTicket80(id: number) {
    const { data } = await api.get<Blob>(`/notas-debito/${id}/ticket-80`, { responseType: "blob" })
    return data
  },
}