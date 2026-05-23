import type { PosMetodoPago, PosTipoComprobante, PosTipoVenta, PosSunatEstado } from "@/modules/pos/types/pos.types"

export type VentaEstado = "REGISTRADA" | "ANULADA" | "DEVUELTA"

export type VentaCliente = {
  id: number
  nombres?: string | null
  razon_social?: string | null
  nombre?: string | null
  numero_documento?: string | null
  tipo_documento?: string | null
}

export type VentaUsuario = {
  id: number
  name: string
  email?: string | null
}

export type VentaComprobanteElectronico = {
  id: number
  estado_sunat: PosSunatEstado
  numero_comprobante?: string | null
  tiene_xml?: boolean
  tiene_cdr?: boolean
  tiene_pdf_a4?: boolean
  tiene_ticket_80?: boolean
  tiene_ticket_58?: boolean
}

export type VentaDetalle = {
  id: number
  producto_id: number
  producto_presentacion_id: number
  lote_id?: number | null
  producto?: { id: number; nombre: string } | null
  presentacion?: { id: number; nombre: string } | null
  lote?: { id: number; codigo_lote: string; fecha_vencimiento?: string | null } | null
  descripcion: string
  cantidad_presentacion: number
  factor_conversion: number
  cantidad_base: number
  precio_unitario: number
  descuento: number
  subtotal: number
  igv: number
  total: number
}

export type VentaPago = {
  id: number
  metodo_pago: PosMetodoPago
  monto: number
  referencia?: string | null
  estado?: string
}

export type Venta = {
  id: number
  numero_comprobante: string
  tipo_comprobante: PosTipoComprobante
  tipo_venta: PosTipoVenta
  cliente_id?: number | null
  cliente?: VentaCliente | null
  user?: VentaUsuario | null
  usuario?: VentaUsuario | null
  subtotal: number
  total_igv?: number
  igv?: number
  total_descuento?: number
  descuento?: number
  total: number
  estado: VentaEstado
  fecha_emision: string
  observacion?: string | null
  detalles?: VentaDetalle[]
  pagos?: VentaPago[]
  metodos_pago?: PosMetodoPago[]
  comprobante_electronico?: VentaComprobanteElectronico | null
}

export type VentaFilters = {
  fecha_inicio?: string
  fecha_fin?: string
  tipo_comprobante?: string
  tipo_venta?: string
  estado?: string
  cliente?: string
  numero_comprobante?: string
  metodo_pago?: string
  usuario_id?: string
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
  links?: unknown
  meta: PaginationMeta
}

export function getVentaClienteNombre(cliente?: VentaCliente | null) {
  return cliente?.razon_social || cliente?.nombres || cliente?.nombre || "Clientes varios"
}
