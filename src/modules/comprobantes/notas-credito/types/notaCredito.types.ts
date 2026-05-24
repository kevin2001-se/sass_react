export type NotaCreditoEstado = "BORRADOR" | "REGISTRADA" | "ANULADA"
export type NotaCreditoEstadoSunat = "PENDIENTE" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "ERROR"
export type NotaCreditoTipo = "TOTAL" | "PARCIAL"

export type MotivoNotaCredito = { id?: number; codigo: string; descripcion: string; estado?: boolean }
export type NotaCreditoCliente = { id?: number | null; tipo_documento?: string | null; numero_documento?: string | null; nombre?: string | null; nombres?: string | null; razon_social?: string | null }
export type NotaCreditoVenta = { id: number; numero_comprobante?: string | null; tipo_comprobante?: string | null; total?: number | string | null; cliente?: NotaCreditoCliente | null }
export type NotaCreditoComprobante = { id: number; tipo_comprobante?: string | null; numero_comprobante?: string | null; estado_sunat?: string | null }
export type NotaCreditoDetalle = { id: number; venta_detalle_id?: number | null; producto_id?: number | null; descripcion: string; unidad_medida?: string | null; cantidad: number | string; precio_unitario: number | string; descuento: number | string; subtotal: number | string; igv: number | string; total: number | string }

export type NotaCredito = {
  id: number
  tenant_id?: number
  empresa_id?: number
  tienda_id?: number
  venta_id?: number | null
  comprobante_id?: number | null
  serie?: string | null
  correlativo?: number | null
  numero_completo?: string | null
  motivo_codigo?: string | null
  motivo_descripcion?: string | null
  motivo?: MotivoNotaCredito | null
  tipo_nota: NotaCreditoTipo | string
  afecta_stock?: boolean
  afecta_caja?: boolean
  stock_aplicado?: boolean
  caja_aplicada?: boolean
  stock_aplicado_at?: string | null
  caja_aplicada_at?: string | null
  caja_movimiento_id?: number | null
  mensaje_efectos?: string | null
  subtotal?: number | string | null
  total_descuento?: number | string | null
  total_igv?: number | string | null
  total?: number | string | null
  observacion?: string | null
  motivo_anulacion?: string | null
  estado: NotaCreditoEstado
  estado_sunat?: NotaCreditoEstadoSunat | string | null
  codigo_respuesta?: string | null
  mensaje_respuesta?: string | null
  hash?: string | null
  qr_text?: string | null
  tiene_xml?: boolean
  tiene_cdr?: boolean
  tiene_pdf_a4?: boolean
  tiene_ticket_80?: boolean
  intentos_envio?: number | null
  enviado_at?: string | null
  aceptado_at?: string | null
  rechazado_at?: string | null
  pdf_generado_at?: string | null
  ticket_generado_at?: string | null
  anulado_at?: string | null
  venta?: NotaCreditoVenta | null
  comprobante?: NotaCreditoComprobante | null
  cliente?: NotaCreditoCliente | null
  detalles?: NotaCreditoDetalle[]
  created_at?: string | null
  updated_at?: string | null
}

export type NotaCreditoFilters = { fecha_inicio?: string; fecha_fin?: string; estado?: string; estado_sunat?: string; motivo_codigo?: string; numero?: string; cliente?: string; comprobante_ref?: string; page?: number; per_page?: number }
export type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number }
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta; links?: unknown }

export function getNotaCreditoNumero(nota: NotaCredito) { return nota.numero_completo || `NC #${nota.id}` }
export function getNotaCreditoMotivo(nota: NotaCredito) { const descripcion = nota.motivo?.descripcion || nota.motivo_descripcion; return [nota.motivo_codigo, descripcion].filter(Boolean).join(" - ") || "-" }
export function getNotaCreditoCliente(nota: NotaCredito) { return nota.cliente?.nombre || nota.venta?.cliente?.razon_social || nota.venta?.cliente?.nombres || nota.venta?.cliente?.nombre || "CLIENTES VARIOS" }
export function getNotaCreditoComprobanteRef(nota: NotaCredito) { const tipo = nota.comprobante?.tipo_comprobante || nota.venta?.tipo_comprobante; const numero = nota.comprobante?.numero_comprobante || nota.venta?.numero_comprobante; return [tipo, numero].filter(Boolean).join(" ") || "-" }
export function numberValue(value?: number | string | null) { return Number(value ?? 0) }