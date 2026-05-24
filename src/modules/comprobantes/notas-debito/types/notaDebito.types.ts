export type NotaDebitoEstado = "BORRADOR" | "REGISTRADA" | "ANULADA"
export type NotaDebitoEstadoSunat = "PENDIENTE" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "ERROR"

export type MotivoNotaDebito = { id?: number; codigo: string; descripcion: string; estado?: boolean }
export type NotaDebitoCliente = { id?: number | null; tipo_documento?: string | null; numero_documento?: string | null; nombre?: string | null; nombres?: string | null; razon_social?: string | null }
export type NotaDebitoVenta = { id: number; numero_comprobante?: string | null; tipo_comprobante?: string | null; total?: number | string | null; cliente?: NotaDebitoCliente | null }
export type NotaDebitoComprobante = { id: number; tipo_comprobante?: string | null; numero_comprobante?: string | null; estado_sunat?: string | null }
export type NotaDebitoDetalle = { id: number; descripcion: string; cantidad: number | string; precio_unitario: number | string; subtotal: number | string; igv: number | string; total: number | string }

export type NotaDebito = {
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
  motivo?: MotivoNotaDebito | null
  afecta_caja?: boolean
  caja_aplicada?: boolean
  caja_aplicada_at?: string | null
  caja_movimiento_id?: number | null
  subtotal?: number | string | null
  total_igv?: number | string | null
  total?: number | string | null
  observacion?: string | null
  estado: NotaDebitoEstado
  estado_sunat?: NotaDebitoEstadoSunat | string | null
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
  venta?: NotaDebitoVenta | null
  comprobante?: NotaDebitoComprobante | null
  cliente?: NotaDebitoCliente | null
  detalles?: NotaDebitoDetalle[]
  created_at?: string | null
  updated_at?: string | null
}

export type NotaDebitoFilters = { fecha_inicio?: string; fecha_fin?: string; estado?: string; estado_sunat?: string; motivo_codigo?: string; numero?: string; cliente?: string; comprobante_ref?: string; page?: number; per_page?: number }
export type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number }
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta; links?: unknown }

export function getNotaDebitoNumero(nota: NotaDebito) { return nota.numero_completo || `ND #${nota.id}` }
export function getNotaDebitoMotivo(nota: NotaDebito) { const descripcion = nota.motivo?.descripcion || nota.motivo_descripcion; return [nota.motivo_codigo, descripcion].filter(Boolean).join(" - ") || "-" }
export function getNotaDebitoCliente(nota: NotaDebito) { return nota.cliente?.nombre || nota.venta?.cliente?.razon_social || nota.venta?.cliente?.nombres || nota.venta?.cliente?.nombre || "CLIENTES VARIOS" }
export function getNotaDebitoComprobanteRef(nota: NotaDebito) { const tipo = nota.comprobante?.tipo_comprobante || nota.venta?.tipo_comprobante; const numero = nota.comprobante?.numero_comprobante || nota.venta?.numero_comprobante; return [tipo, numero].filter(Boolean).join(" ") || "-" }
export function numberValue(value?: number | string | null) { return Number(value ?? 0) }