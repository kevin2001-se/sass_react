import { api, getLaravelErrorMessage } from "@/shared/services/api"
import { downloadBlob, openBlob, openPrintableBlob } from "@/shared/utils/blob"
import type { Venta } from "@/modules/ventas/types/venta.types"

function filename(venta: Venta, suffix: string) {
  return `${venta.numero_comprobante || `venta-${venta.id}`}-${suffix}.pdf`
}

async function blobGet(url: string) {
  const { data } = await api.get<Blob>(url, { responseType: "blob" })
  return data
}

export const ventaDocumentoService = {
  async generarTicket(venta: Venta) {
    const { data } = await api.post(`/ventas/${venta.id}/ticket`)
    return data
  },

  async descargarTicket(venta: Venta) {
    return blobGet(`/ventas/${venta.id}/ticket`)
  },

  async abrirTicket(venta: Venta) {
    await this.generarTicket(venta)
    const blob = await this.descargarTicket(venta)
    const opened = openPrintableBlob(blob)

    if (!opened) {
      downloadBlob(blob, filename(venta, "ticket-80"))
    }

    return opened
  },

  async generarPdf(venta: Venta) {
    const { data } = await api.post(`/ventas/${venta.id}/pdf`)
    return data
  },

  async descargarPdf(venta: Venta) {
    return blobGet(`/ventas/${venta.id}/pdf`)
  },

  async abrirPdf(venta: Venta) {
    await this.generarPdf(venta)
    const blob = await this.descargarPdf(venta)
    const opened = openBlob(blob)

    if (!opened) {
      downloadBlob(blob, filename(venta, "a4"))
    }

    return opened
  },

  getErrorMessage(error: unknown) {
    const message = getLaravelErrorMessage(error, "")
    if (message) return message
    if (error instanceof Error) return error.message
    return "No se pudo generar el documento."
  },
}