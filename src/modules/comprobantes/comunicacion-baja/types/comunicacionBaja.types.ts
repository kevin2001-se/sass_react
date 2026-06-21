export type ComunicacionBajaEstado = "REGISTRADA" | "ANULADA" | string
export type ComunicacionBajaEstadoSunat = "PENDIENTE" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "ERROR" | string
export type ComunicacionBajaDocumentoTipo = "BOLETA" | "FACTURA" | "NOTA_CREDITO" | "NOTA_DEBITO" | string
export type EstadoBaja = "SIN_BAJA" | "PENDIENTE_BAJA" | "EN_BAJA" | "BAJA_ACEPTADA" | "BAJA_RECHAZADA" | string

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

export type ComunicacionBajaDetalle = {
  id: number
  comunicacion_baja_id?: number | null
  comprobante_id?: number | null
  comprobante_electronico_id?: number | null
  tipo_documento: ComunicacionBajaDocumentoTipo
  serie?: string | null
  correlativo?: string | number | null
  numero_comprobante?: string | null
  numero_completo?: string | null
  motivo_baja?: string | null
  comprobante?: DocumentoPendienteBaja | null
  created_at?: string | null
}

export type ComunicacionBaja = {
  id: number
  tenant_id?: number
  empresa_id?: number
  tienda_id?: number
  fecha_baja: string
  identificador: string
  correlativo?: number | string | null
  estado: ComunicacionBajaEstado
  estado_sunat: ComunicacionBajaEstadoSunat
  total_documentos?: number | string | null
  observacion?: string | null
  motivo_anulacion?: string | null
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
  tienda?: { id: number; nombre?: string | null; codigo?: string | null } | null
  creado_por?: { id: number; name?: string | null } | null
  anulado_por?: { id: number; name?: string | null } | null
  detalles_count?: number | string | null
  detalles?: ComunicacionBajaDetalle[]
  created_at?: string | null
  updated_at?: string | null
}

export type DocumentoPendienteBaja = {
  id: number
  tipo_comprobante?: string | null
  tipo_documento?: string | null
  serie?: string | null
  correlativo?: string | number | null
  numero_comprobante?: string | null
  numero_completo?: string | null
  cliente_nombre?: string | null
  cliente?: { id?: number; nombre?: string | null; razon_social?: string | null; nombres?: string | null; numero_documento?: string | null } | null
  venta?: { id?: number; cliente?: { nombre?: string | null; razon_social?: string | null; nombres?: string | null; numero_documento?: string | null } | null } | null
  estado_sunat?: string | null
  estado_baja?: EstadoBaja | null
  motivo_baja?: string | null
  fecha_solicitud_baja?: string | null
}

export type ComunicacionBajaFilters = {
  fecha_inicio?: string
  fecha_fin?: string
  estado?: string
  estado_sunat?: string
  identificador?: string
  page?: number
  per_page?: number
}

export type DocumentosPendientesBajaFilters = {
  fecha_baja?: string
}

export type GenerarComunicacionBajaPayload = {
  fecha_baja: string
  comprobantes: number[]
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

export function getDocumentoNumero(documento: Pick<DocumentoPendienteBaja, "numero_completo" | "numero_comprobante" | "serie" | "correlativo">) {
  return documento.numero_completo ?? documento.numero_comprobante ?? [documento.serie, documento.correlativo].filter(Boolean).join("-") ?? "-"
}

export function getDocumentoCliente(documento: DocumentoPendienteBaja) {
  const cliente = documento.cliente ?? documento.venta?.cliente
  return documento.cliente_nombre ?? cliente?.razon_social ?? cliente?.nombre ?? cliente?.nombres ?? "Cliente varios"
}
