import { api } from "@/shared/services/api"
import type { ComprobanteElectronico, ComprobanteFilters, PaginatedResponse } from "@/modules/comprobantes/types/comprobante.types"
import { ventaService } from "@/modules/ventas/services/venta.service"
import type { Venta } from "@/modules/ventas/types/venta.types"

function cleanParams(filters: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== "" && value !== null))
}

function ventaPendienteToComprobante(venta: Venta): ComprobanteElectronico {
  return {
    id: -venta.id,
    venta_id: venta.id,
    tipo_comprobante: venta.tipo_comprobante,
    serie: venta.numero_comprobante?.split("-")[0] ?? "",
    correlativo: venta.numero_comprobante?.split("-")[1] ?? "",
    numero_comprobante: venta.numero_comprobante,
    fecha_emision: venta.fecha_emision,
    moneda: "PEN",
    estado_sunat: "PENDIENTE",
    codigo_respuesta: null,
    mensaje_respuesta: "Pendiente de emision SUNAT",
    intentos_envio: 0,
    venta: {
      id: venta.id,
      numero_comprobante: venta.numero_comprobante,
      subtotal: venta.subtotal,
      total_igv: venta.total_igv ?? venta.igv ?? 0,
      total_descuento: venta.total_descuento ?? venta.descuento ?? 0,
      total: venta.total,
      cliente: venta.cliente,
    },
    cliente: venta.cliente,
    subtotal: venta.subtotal,
    total_igv: venta.total_igv ?? venta.igv ?? 0,
    total_descuento: venta.total_descuento ?? venta.descuento ?? 0,
    total: venta.total,
    tiene_xml: false,
    tiene_cdr: false,
    tiene_pdf_a4: false,
    tiene_ticket_80: false,
    tiene_ticket_58: false,
  }
}

async function getVentasPendientes(filters: ComprobanteFilters) {
  if (filters.tipo_comprobante !== "BOLETA" && filters.tipo_comprobante !== "FACTURA") {
    return []
  }

  const ventas = await ventaService.getVentas({
    fecha_inicio: filters.fecha_inicio,
    fecha_fin: filters.fecha_fin,
    tipo_comprobante: filters.tipo_comprobante,
    cliente: filters.cliente,
    numero_comprobante: filters.numero,
    estado: "REGISTRADA",
    page: filters.page,
    per_page: filters.per_page,
  })

  return (ventas.data ?? [])
    .filter((venta) => !venta.comprobante_electronico)
    .map(ventaPendienteToComprobante)
}

export const comprobanteService = {
  async getComprobantes(filters: ComprobanteFilters = {}) {
    const params = cleanParams(filters)
    const [{ data }, pendientes] = await Promise.all([
      api.get<PaginatedResponse<ComprobanteElectronico>>("/sunat/comprobantes", { params }),
      getVentasPendientes(filters),
    ])

    if (pendientes.length === 0) {
      return data
    }

    const emitted = data.data ?? []
    const merged = [...pendientes, ...emitted].sort((a, b) => String(b.fecha_emision).localeCompare(String(a.fecha_emision)))

    return {
      ...data,
      data: merged,
      meta: data.meta ? { ...data.meta, total: Number(data.meta.total ?? 0) + pendientes.length } : data.meta,
    }
  },
  async getComprobante(id: number) {
    const { data } = await api.get<{ data: ComprobanteElectronico } | ComprobanteElectronico>(`/sunat/comprobantes/${id}`)
    return "data" in data ? data.data : data
  },
  async emitir(ventaId: number) {
    const { data } = await api.post<{ data: ComprobanteElectronico } | ComprobanteElectronico>(`/sunat/comprobantes/emitir/${ventaId}`)
    return "data" in data ? data.data : data
  },
  async reenviar(id: number) {
    const { data } = await api.post<{ data: ComprobanteElectronico } | ComprobanteElectronico>(`/sunat/comprobantes/${id}/reenviar`)
    return "data" in data ? data.data : data
  },
  async descargarPdfA4(id: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${id}/pdf-a4`, { responseType: "blob" })
    return data
  },
  async descargarTicket80(id: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${id}/ticket-80`, { responseType: "blob" })
    return data
  },
  async descargarTicket58(id: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${id}/ticket-58`, { responseType: "blob" })
    return data
  },
  async descargarXml(id: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${id}/xml`, { responseType: "blob" })
    return data
  },
  async descargarCdr(id: number) {
    const { data } = await api.get<Blob>(`/sunat/documentos/${id}/cdr`, { responseType: "blob" })
    return data
  },
  async generarPdfA4(id: number) {
    const { data } = await api.post(`/sunat/documentos/${id}/generar-pdf-a4`)
    return data
  },
  async generarTicket80(id: number) {
    const { data } = await api.post(`/sunat/documentos/${id}/generar-ticket-80`)
    return data
  },
}