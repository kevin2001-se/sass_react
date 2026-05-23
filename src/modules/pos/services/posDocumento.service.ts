import { api } from "@/shared/services/api"
import type { PosComprobanteElectronico } from "@/modules/pos/types/pos.types"

export const posDocumentoService = {
  async generarTicketVenta80(ventaId: number) {
    const { data } = await api.post(`/ventas/${ventaId}/ticket`)
    return data
  },
  async descargarTicketVenta80(ventaId: number) {
    const { data } = await api.get<Blob>(`/ventas/${ventaId}/ticket`, { responseType: "blob" })
    return data
  },
  async generarPdfVentaA4(ventaId: number) {
    const { data } = await api.post(`/ventas/${ventaId}/pdf`)
    return data
  },
  async descargarPdfVentaA4(ventaId: number) {
    const { data } = await api.get<Blob>(`/ventas/${ventaId}/pdf`, { responseType: "blob" })
    return data
  },  async generarTicket80(comprobanteId: number) {
    const { data } = await api.post(`/sunat/documentos/${comprobanteId}/generar-ticket-80`)
    return data
  },
  async generarTicket58(comprobanteId: number) {
    const { data } = await api.post(`/sunat/documentos/${comprobanteId}/generar-ticket-58`)
    return data
  },
  async generarPdfA4(comprobanteId: number) {
    const { data } = await api.post(`/sunat/documentos/${comprobanteId}/generar-pdf-a4`)
    return data
  },
  async generarFormatos(comprobanteId: number) {
    const { data } = await api.post(`/sunat/documentos/${comprobanteId}/generar-formatos`)
    return data
  },
  async descargarTicket80(comprobanteId: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${comprobanteId}/ticket-80`, { responseType: "blob" })
    return data
  },
  async descargarTicket58(comprobanteId: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${comprobanteId}/ticket-58`, { responseType: "blob" })
    return data
  },
  async descargarPdfA4(comprobanteId: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${comprobanteId}/pdf-a4`, { responseType: "blob" })
    return data
  },
  async descargarXml(comprobanteId: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${comprobanteId}/xml`, { responseType: "blob" })
    return data
  },
  async descargarCdr(comprobanteId: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${comprobanteId}/cdr`, { responseType: "blob" })
    return data
  },
  async emitirSunat(ventaId: number) {
    const { data } = await api.post<{ data?: PosComprobanteElectronico } | PosComprobanteElectronico>(`/sunat/comprobantes/emitir/${ventaId}`)
    return "data" in data && data.data ? data.data : data as PosComprobanteElectronico
  },
  async reenviarSunat(comprobanteId: number) {
    const { data } = await api.post<{ data?: PosComprobanteElectronico } | PosComprobanteElectronico>(`/sunat/comprobantes/${comprobanteId}/reenviar`)
    return "data" in data && data.data ? data.data : data as PosComprobanteElectronico
  },
  async obtenerComprobante(comprobanteId: number) {
    const { data } = await api.get<{ data?: PosComprobanteElectronico } | PosComprobanteElectronico>(`/sunat/comprobantes/${comprobanteId}`)
    return "data" in data && data.data ? data.data : data as PosComprobanteElectronico
  },
}


