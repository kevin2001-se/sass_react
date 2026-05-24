import { api } from "@/shared/services/api"
import type { NotaDebito } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"

function responseData(response: { data: NotaDebito } | { success: boolean; data: NotaDebito } | NotaDebito) {
  return "data" in response ? response.data : response
}

export const notaDebitoSunatService = {
  async enviarSunat(id: number) {
    const { data } = await api.post<{ data: NotaDebito } | { success: boolean; data: NotaDebito } | NotaDebito>(`/notas-debito/${id}/enviar-sunat`)
    return responseData(data)
  },

  async reenviarSunat(id: number) {
    const { data } = await api.post<{ data: NotaDebito } | { success: boolean; data: NotaDebito } | NotaDebito>(`/notas-debito/${id}/reenviar-sunat`)
    return responseData(data)
  },

  async descargarXml(id: number) {
    const { data } = await api.get<Blob>(`/notas-debito/${id}/xml`, { responseType: "blob" })
    return data
  },

  async descargarCdr(id: number) {
    const { data } = await api.get<Blob>(`/notas-debito/${id}/cdr`, { responseType: "blob" })
    return data
  },
}