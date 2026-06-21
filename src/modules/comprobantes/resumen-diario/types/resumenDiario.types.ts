export type ResumenDiarioEstado = "BORRADOR" | "REGISTRADO" | "ANULADO"
export type ResumenDiarioEstadoSunat = "PENDIENTE" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "ERROR"
export type ResumenDiarioDocumentoTipo = "BOLETA" | "NOTA_CREDITO" | "NOTA_DEBITO"
export type ResumenDiarioAccion = "ALTA" | "BAJA"

export type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PaginationMeta
}

export type ResumenDiarioDetalle = {
  id: number
  documento_id?: number | null
  comprobante_electronico_id?: number | null
  tipo_documento: ResumenDiarioDocumentoTipo | string
  serie?: string | null
  correlativo?: string | number | null
  numero_comprobante?: string | null
  numero_completo?: string | null
  cliente_tipo_documento?: string | null
  cliente_numero_documento?: string | null
  cliente_nombre?: string | null
  subtotal?: number | string | null
  total_igv?: number | string | null
  total?: number | string | null
  estado_documento?: string | null
  estado_item?: string | null
  accion?: ResumenDiarioAccion | string | null
  estado_baja?: string | null
  motivo_baja?: string | null
}

export type ResumenDiario = {
  id: number
  tenant_id?: number
  empresa_id?: number
  tienda_id?: number
  fecha_resumen: string
  fecha_envio?: string | null
  identificador: string
  correlativo?: number | string | null
  estado: ResumenDiarioEstado | string
  estado_sunat: ResumenDiarioEstadoSunat | string
  total_documentos?: number | string | null
  total_boletas?: number | string | null
  total_notas_credito?: number | string | null
  total_notas_debito?: number | string | null
  monto_total?: number | string | null
  observacion?: string | null
  ticket?: string | null
  ticket_sunat?: string | null
  hash?: string | null
  codigo_respuesta?: string | null
  mensaje_respuesta?: string | null
  intentos_envio?: number | string | null
  tiene_pdf_a4?: boolean
  tiene_xml?: boolean
  tiene_cdr?: boolean
  pdf_generado_at?: string | null
  enviado_at?: string | null
  consultado_at?: string | null
  aceptado_at?: string | null
  rechazado_at?: string | null
  anulado_at?: string | null
  motivo_anulacion?: string | null
  tienda?: {
    id: number
    nombre?: string | null
    codigo?: string | null
  } | null
  usuario?: {
    id: number
    name?: string | null
  } | null
  anulado_por?: {
    id: number
    name?: string | null
  } | null
  detalles?: ResumenDiarioDetalle[]
}

export type ResumenDiarioFilters = {
  fecha_inicio?: string
  fecha_fin?: string
  estado?: string
  estado_sunat?: string
  identificador?: string
  page?: number
  per_page?: number
}

export type GenerarResumenDiarioPayload = {
  fecha_resumen: string
  observacion?: string | null
}

export type ApiSuccess<T> = {
  success?: boolean
  message?: string
  data: T
}

export function toNumber(value: number | string | null | undefined) {
  const numeric = Number(value ?? 0)
  return Number.isFinite(numeric) ? numeric : 0
}