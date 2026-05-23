export type PosProductoPresentacion = {
  id: number
  nombre: string
  codigo_barra?: string | null
  factor_conversion: number
  precio_venta: number
  stock_disponible_base: number
  stock_disponible_presentacion: number
  estado?: boolean
}

export type PosProductoLote = {
  id: number
  codigo_lote: string
  fecha_vencimiento?: string | null
  stock_disponible_base: number
  sugerido_fefo: boolean
  estado?: boolean
}

export type PosCatalogo = {
  id: number
  nombre: string
}

export type PosProductoSearchItem = {
  id: number
  codigo_interno: string
  nombre: string
  concentracion?: string | null
  requiere_receta: boolean
  maneja_lote: boolean
  maneja_vencimiento: boolean
  afecto_igv: boolean
  categoria?: PosCatalogo | null
  laboratorio?: PosCatalogo | null
  principio_activo?: PosCatalogo | null
  presentaciones: PosProductoPresentacion[]
  lotes: PosProductoLote[]
}

export type PosProductSearchResponse = {
  data: PosProductoSearchItem[]
}

export type AddPosItemPayload = {
  producto: PosProductoSearchItem
  presentacion: PosProductoPresentacion
  lote?: PosProductoLote | null
  cantidad_presentacion?: number
}
