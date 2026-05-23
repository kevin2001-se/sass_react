export type GuiaRemisionEstado = "BORRADOR" | "REGISTRADA" | "ANULADA"
export type GuiaRemisionEstadoSunat = "PENDIENTE" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "ERROR"

export type GuiaRemisionMotivo = {
  codigo: string
  descripcion: string
}

export type GuiaRemisionModalidad = {
  codigo: string
  descripcion: string
}

export type GuiaRemisionDetalle = {
  id: number
  producto_id?: number | null
  descripcion: string
  unidad_medida: string
  cantidad: number | string
  peso?: number | string | null
}

export type GuiaRemision = {
  id: number
  tenant_id?: number
  empresa_id?: number
  tienda_id?: number
  venta_id?: number | null
  comprobante_id?: number | null
  serie?: string | null
  correlativo?: number | null
  numero_completo?: string | null
  numero_guia?: string | null
  fecha_emision?: string | null
  fecha_traslado?: string | null
  motivo_traslado_codigo?: string | null
  motivo_traslado_descripcion?: string | null
  motivo_traslado?: GuiaRemisionMotivo | null
  modalidad_transporte?: string | null
  modalidad?: GuiaRemisionModalidad | null
  modalidad_transporte_detalle?: GuiaRemisionModalidad | null
  estado: GuiaRemisionEstado
  estado_sunat?: GuiaRemisionEstadoSunat | string | null
  destinatario_tipo_documento?: string | null
  destinatario_numero_documento?: string | null
  destinatario_nombre?: string | null
  punto_partida_departamento_id?: number | null
  punto_partida_provincia_id?: number | null
  punto_partida_distrito_id?: number | null
  punto_partida_ubigeo?: string | null
  punto_partida_direccion?: string | null
  punto_llegada_departamento_id?: number | null
  punto_llegada_provincia_id?: number | null
  punto_llegada_distrito_id?: number | null
  punto_llegada_ubigeo?: string | null
  punto_llegada_direccion?: string | null
  conductor_tipo_documento?: string | null
  conductor_numero_documento?: string | null
  conductor_nombre?: string | null
  conductor_licencia?: string | null
  vehiculo_placa?: string | null
  transportista_ruc?: string | null
  transportista_razon_social?: string | null
  peso_total?: number | string | null
  unidad_peso?: string | null
  numero_bultos?: number | null
  observacion?: string | null
  codigo_respuesta?: string | null
  mensaje_respuesta?: string | null
  tiene_xml?: boolean
  tiene_cdr?: boolean
  tiene_pdf_a4?: boolean
  tiene_ticket_80?: boolean
  detalles?: GuiaRemisionDetalle[]
  created_at?: string | null
  updated_at?: string | null
}

export type GuiaRemisionFilters = {
  fecha_inicio?: string
  fecha_fin?: string
  estado?: string
  estado_sunat?: string
  motivo_traslado_codigo?: string
  modalidad_transporte?: string
  numero?: string
  destinatario?: string
  page?: number
  per_page?: number
}

export type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PaginationMeta
  links?: unknown
}

export function getGuiaNumero(guia: GuiaRemision) {
  return guia.numero_completo || guia.numero_guia || `Guia #${guia.id}`
}

export function getGuiaMotivo(guia: GuiaRemision) {
  return guia.motivo_traslado?.descripcion || guia.motivo_traslado_descripcion || guia.motivo_traslado_codigo || "-"
}

export function getGuiaModalidad(guia: GuiaRemision) {
  return guia.modalidad?.descripcion || guia.modalidad_transporte_detalle?.descripcion || guia.modalidad_transporte || "-"
}

export type GuiaVentaDataProducto = {
  id?: number
  producto_id?: number
  descripcion?: string | null
  producto?: { id: number; nombre: string } | null
  presentacion?: { id: number; nombre: string } | null
  unidad_medida?: string | null
  cantidad?: number | string | null
  cantidad_presentacion?: number | string | null
}

export type GuiaVentaData = {
  cliente?: {
    id?: number | null
    tipo_documento?: string | null
    numero_documento?: string | null
    nombres?: string | null
    razon_social?: string | null
    nombre?: string | null
    direccion?: string | null
  } | null
  comprobante?: {
    id?: number | null
    tipo?: string | null
    tipo_comprobante?: string | null
    numero?: string | null
    numero_comprobante?: string | null
  } | null
  productos?: GuiaVentaDataProducto[]
  detalles?: GuiaVentaDataProducto[]
  direccion_sugerida?: string | null
  punto_partida?: {
    ubigeo?: string | null
    direccion?: string | null
  } | null
  tienda?: {
    id?: number
    nombre?: string | null
    ubigeo?: string | null
    direccion?: string | null
  } | null
}