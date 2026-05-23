import type { PaginatedResponse, Producto, ProductoPresentacion } from "@/modules/productos/types/producto.types"
import type { User } from "@/shared/types/auth.types"

export type Stock = {
  id: number
  producto_id: number
  producto?: Producto | null
  lote_id?: number | null
  lote?: Lote | null
  cantidad_actual: number
  cantidad_minima?: number | null
  cantidad_maxima?: number | null
  estado: boolean
  created_at?: string
  updated_at?: string
}

export type Lote = {
  id: number
  producto_id: number
  producto?: Producto | null
  codigo_lote: string
  fecha_vencimiento?: string | null
  estado: boolean
  stock?: Stock | null
  created_at?: string
  updated_at?: string
}

export type InventarioMovimiento = {
  id: number
  producto_id: number
  producto?: Producto | null
  producto_presentacion_id: number
  presentacion?: ProductoPresentacion | null
  lote_id?: number | null
  lote?: Lote | null
  tipo_movimiento: "ENTRADA" | "SALIDA" | "AJUSTE_POSITIVO" | "AJUSTE_NEGATIVO" | "VENTA" | "COMPRA" | "DEVOLUCION"
  motivo: string
  cantidad_presentacion: number
  factor_conversion: number
  cantidad_base: number
  stock_anterior: number
  stock_nuevo: number
  referencia_tipo?: string | null
  referencia_id?: number | null
  observacion?: string | null
  user_id: number
  user?: User | null
  created_at?: string
}

export type KardexMovimiento = InventarioMovimiento

export type InventarioEntradaPayload = {
  producto_id: number
  producto_presentacion_id: number
  lote_id?: number | null
  cantidad_presentacion: number
  motivo: string
  observacion?: string | null
}

export type InventarioSalidaPayload = InventarioEntradaPayload

export type InventarioAjustePayload = InventarioEntradaPayload & {
  tipo_ajuste: "POSITIVO" | "NEGATIVO"
}

export type LotePayload = {
  producto_id: number
  codigo_lote: string
  fecha_vencimiento?: string | null
  estado: boolean
}

export type StockFilters = {
  buscar?: string
  producto_id?: string
  categoria_id?: string
  bajo_stock?: string
  estado?: string
  page?: number
  per_page?: number
}

export type LoteFilters = {
  buscar?: string
  producto_id?: string
  estado?: string
  vencimiento?: string
  fecha_inicio?: string
  fecha_fin?: string
  page?: number
  per_page?: number
}

export type MovimientoFilters = {
  producto_id?: string
  lote_id?: string
  tipo_movimiento?: string
  fecha_inicio?: string
  fecha_fin?: string
  page?: number
  per_page?: number
}

export type InventarioPaginated<T> = PaginatedResponse<T>
