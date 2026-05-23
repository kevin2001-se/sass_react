export type EstadoSunat = "PENDIENTE" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "ERROR" | "DADO_DE_BAJA" | "NO_APLICA"
export type TipoComprobanteElectronico = "BOLETA" | "FACTURA" | "NOTA_CREDITO" | "NOTA_DEBITO" | "GUIA_REMISION"

export type ComprobanteCliente = {
  id?: number | null
  nombres?: string | null
  razon_social?: string | null
  nombre?: string | null
  numero_documento?: string | null
}

export type ComprobanteVenta = {
  id: number
  numero_comprobante?: string | null
  total?: number | string | null
  cliente?: ComprobanteCliente | null
}

export type ComprobanteElectronico = {
  id: number
  venta_id?: number | null
  nota_electronica_id?: number | null
  guia_remision_id?: number | null
  tipo_comprobante: TipoComprobanteElectronico | string
  serie: string
  correlativo: number | string
  numero_comprobante: string
  fecha_emision: string
  moneda?: string
  estado_sunat: EstadoSunat | string
  codigo_respuesta?: string | null
  mensaje_respuesta?: string | null
  hash?: string | null
  qr_text?: string | null
  intentos_envio?: number
  enviado_at?: string | null
  aceptado_at?: string | null
  rechazado_at?: string | null
  venta?: ComprobanteVenta | null
  cliente?: ComprobanteCliente | null
  total?: number | string | null
  tiene_xml?: boolean
  tiene_cdr?: boolean
  tiene_pdf_a4?: boolean
  tiene_ticket_80?: boolean
  tiene_ticket_58?: boolean
  created_at?: string
}

export type ComprobanteFilters = {
  fecha_inicio?: string
  fecha_fin?: string
  serie?: string
  numero?: string
  cliente?: string
  estado_sunat?: string
  tipo_comprobante?: string
  page?: number
  per_page?: number
}

export type NotaElectronica = {
  id: number
  tipo_nota: "NOTA_CREDITO" | "NOTA_DEBITO" | string
  numero_comprobante: string
  fecha_emision: string
  total: number | string
  estado: string
  motivo_codigo: string
  motivo_descripcion: string
  comprobante_electronico?: ComprobanteElectronico | null
}

export type ResumenDiario = {
  id: number
  identificador: string
  fecha_resumen: string
  fecha_envio: string
  estado_sunat: EstadoSunat | string
  ticket?: string | null
  codigo_respuesta?: string | null
  mensaje_respuesta?: string | null
  intentos_envio?: number
  detalles?: unknown[]
  total_documentos?: number
}

export type ComunicacionBaja = {
  id: number
  identificador: string
  fecha_baja: string
  fecha_envio: string
  estado_sunat: EstadoSunat | string
  ticket?: string | null
  codigo_respuesta?: string | null
  mensaje_respuesta?: string | null
  intentos_envio?: number
  detalles?: unknown[]
  total_documentos?: number
}

export type GuiaRemision = {
  id: number
  numero_guia: string
  fecha_emision: string
  fecha_traslado: string
  motivo_traslado_codigo: string
  motivo_traslado_descripcion: string
  modalidad_transporte: string
  estado: string
  comprobante_electronico?: ComprobanteElectronico | null
}

export type PaginatedResponse<T> = {
  data: T[]
  links?: unknown
  meta?: { current_page: number; last_page: number; per_page: number; total: number }
}

export type NotaElectronicaPayload = {
  comprobante_referencia_id: number
  motivo_codigo: string
  motivo_descripcion: string
  afecta_stock?: boolean
  afecta_caja?: boolean
  observacion?: string | null
}

export type ResumenDiarioPayload = {
  fecha_resumen: string
  incluir_boletas: boolean
  incluir_notas_credito: boolean
  incluir_notas_debito: boolean
}

export type ComunicacionBajaPayload = {
  fecha_baja: string
  comprobantes: Array<{ comprobante_electronico_id: number; motivo_baja: string }>
}

export type GuiaRemisionPayload = Record<string, unknown>

export function getComprobanteClienteNombre(comprobante: ComprobanteElectronico) {
  const cliente = comprobante.cliente ?? comprobante.venta?.cliente
  return cliente?.razon_social || cliente?.nombres || cliente?.nombre || "Clientes varios"
}

export function getComprobanteTotal(comprobante: ComprobanteElectronico) {
  return Number(comprobante.total ?? comprobante.venta?.total ?? 0)
}