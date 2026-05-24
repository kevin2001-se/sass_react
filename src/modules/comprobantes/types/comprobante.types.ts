export type EstadoSunat = "PENDIENTE" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "ERROR" | "DADO_DE_BAJA" | "NO_APLICA"
export type TipoComprobanteElectronico = "BOLETA" | "FACTURA" | "NOTA_CREDITO" | "NOTA_DEBITO" | "GUIA_REMISION"

export type ComprobanteCliente = {
  id?: number | null
  nombres?: string | null
  razon_social?: string | null
  nombre?: string | null
  numero_documento?: string | null
  tipo_documento?: string | null
}

export type ComprobanteVentaDetalle = {
  id: number
  producto_id?: number | null
  descripcion: string
  unidad_medida?: string | null
  cantidad_presentacion?: number | string | null
  cantidad?: number | string | null
  cantidad_disponible_devolucion?: number | string | null
  precio_unitario?: number | string | null
  descuento?: number | string | null
  subtotal?: number | string | null
  igv?: number | string | null
  total?: number | string | null
  producto?: { id: number; nombre: string } | null
  presentacion?: { id: number; nombre: string } | null
}
export type ComprobanteVenta = {
  id: number
  numero_comprobante?: string | null
  estado?: string | null
  subtotal?: number | string | null
  total_igv?: number | string | null
  total_descuento?: number | string | null
  total?: number | string | null
  cliente?: ComprobanteCliente | null
  detalles?: ComprobanteVentaDetalle[]
  notas_credito_count?: number | string | null
  notas_credito?: unknown[]
  notas_debito_count?: number | string | null
  notas_debito?: unknown[]
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
  subtotal?: number | string | null
  total_igv?: number | string | null
  total_descuento?: number | string | null
  total?: number | string | null
  tiene_xml?: boolean
  tiene_cdr?: boolean
  tiene_pdf_a4?: boolean
  tiene_ticket_80?: boolean
  tiene_ticket_58?: boolean
  notas_credito_count?: number | string | null
  notas_credito?: unknown[]
  notas_debito_count?: number | string | null
  notas_debito?: unknown[]
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

function toComprobanteNumber(value: number | string | null | undefined) {
  return Number(value ?? 0)
}

export function getComprobanteSubtotal(comprobante: ComprobanteElectronico) {
  return toComprobanteNumber(comprobante.subtotal ?? comprobante.venta?.subtotal ?? 0)
}

export function getComprobanteIgv(comprobante: ComprobanteElectronico) {
  return toComprobanteNumber(comprobante.total_igv ?? comprobante.venta?.total_igv ?? 0)
}

export function getComprobanteDescuento(comprobante: ComprobanteElectronico) {
  return toComprobanteNumber(comprobante.total_descuento ?? comprobante.venta?.total_descuento ?? 0)
}

export function getComprobanteTotal(comprobante: ComprobanteElectronico) {
  return toComprobanteNumber(comprobante.total ?? comprobante.venta?.total ?? 0)
}
export function getComprobanteNotasCreditoCount(comprobante: ComprobanteElectronico) {
  const direct = comprobante.notas_credito_count
  if (direct !== undefined && direct !== null) return Number(direct)
  if (Array.isArray(comprobante.notas_credito)) return comprobante.notas_credito.length
  const ventaCount = comprobante.venta?.notas_credito_count
  if (ventaCount !== undefined && ventaCount !== null) return Number(ventaCount)
  if (Array.isArray(comprobante.venta?.notas_credito)) return comprobante.venta.notas_credito.length
  return 0
}

export function getComprobanteNotasDebitoCount(comprobante: ComprobanteElectronico) {
  const direct = comprobante.notas_debito_count
  if (direct !== undefined && direct !== null) return Number(direct)
  if (Array.isArray(comprobante.notas_debito)) return comprobante.notas_debito.length
  const ventaCount = comprobante.venta?.notas_debito_count
  if (ventaCount !== undefined && ventaCount !== null) return Number(ventaCount)
  if (Array.isArray(comprobante.venta?.notas_debito)) return comprobante.venta.notas_debito.length
  return 0
}

