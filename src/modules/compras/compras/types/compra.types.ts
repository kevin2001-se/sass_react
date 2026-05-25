import type { Proveedor } from "@/modules/compras/proveedores/types/proveedor.types"
import type { Lote, InventarioMovimiento } from "@/modules/inventario/types/inventario.types"
import type { Producto, ProductoPresentacion } from "@/modules/productos/types/producto.types"

export type CompraTipoDocumento = "FACTURA" | "BOLETA" | "NOTA_COMPRA" | "GUIA_PROVEEDOR"
export type CompraTipoPago = "CONTADO" | "CREDITO"
export type CompraEstado = "REGISTRADA" | "ANULADA"
export type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number }
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta }

export type CompraFilters = {
  fecha_inicio?: string
  fecha_fin?: string
  proveedor_id?: string
  tipo_documento?: string
  tipo_pago?: string
  estado?: string
  numero_documento?: string
  page?: number
  per_page?: number
}

export type CompraDetalleFormValues = {
  producto_id: number | null
  producto_presentacion_id: number | null
  lote_id?: number | null
  codigo_lote?: string | null
  fecha_vencimiento?: string | null
  cantidad_presentacion: number
  costo_unitario: number
  descuento: number
}

export type CompraFormValues = {
  proveedor_id: number | null
  tipo_documento: CompraTipoDocumento
  serie: string
  correlativo: string
  fecha_emision: string
  fecha_vencimiento?: string | null
  tipo_pago: CompraTipoPago
  moneda: "PEN" | "USD"
  observacion?: string | null
  detalles: CompraDetalleFormValues[]
}

export type CompraPayload = Omit<CompraFormValues, "proveedor_id"> & { proveedor_id: number }

export type CompraDetalle = {
  id: number
  producto_id: number
  producto?: Producto | null
  producto_presentacion_id: number
  presentacion?: ProductoPresentacion | null
  lote_id?: number | null
  lote?: Lote | null
  descripcion: string
  cantidad_presentacion: number | string
  factor_conversion: number | string
  cantidad_base: number | string
  costo_unitario: number | string
  precio_unitario: number | string
  descuento: number | string
  subtotal: number | string
  igv: number | string
  total: number | string
  fecha_vencimiento?: string | null
}

export type Compra = {
  id: number
  proveedor_id: number
  proveedor?: Proveedor | null
  tienda?: { id: number; nombre: string; codigo?: string; direccion?: string | null } | null
  user?: { id: number; name: string; email?: string } | null
  tipo_documento: CompraTipoDocumento
  tipo_comprobante: CompraTipoDocumento
  serie: string
  correlativo: string
  numero: string
  numero_documento: string
  tipo_pago: CompraTipoPago
  tipo_compra: CompraTipoPago
  moneda: string
  fecha_emision: string
  fecha_vencimiento?: string | null
  subtotal: number | string
  total_igv: number | string
  total_descuento: number | string
  total: number | string
  estado: CompraEstado
  observacion?: string | null
  motivo_anulacion?: string | null
  anulado_at?: string | null
  tiene_pdf?: boolean
  pdf_generado_at?: string | null
  detalles?: CompraDetalle[]
  movimientos_inventario?: InventarioMovimiento[]
}

export type CompraResponse = Compra | { data: Compra }
export type AnularCompraPayload = { motivo: string }
