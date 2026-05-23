export type CatalogoBase = {
  id: number
  nombre: string
  estado?: boolean
}

export type Categoria = CatalogoBase
export type Marca = CatalogoBase
export type Laboratorio = CatalogoBase
export type PrincipioActivo = CatalogoBase
export type AccionTerapeutica = CatalogoBase
export type UnidadMedida = CatalogoBase & { codigo?: string; simbolo?: string }

export type AfectacionIgv = {
  id: number
  codigo: string
  descripcion: string
  abreviatura: string
  aplica_igv: boolean
  es_gratuito: boolean
  estado: boolean
}

export type ProductoPresentacion = {
  id?: number
  producto_id?: number
  unidad_medida_id: number
  unidad_medida?: UnidadMedida | null
  nombre: string
  codigo_barra?: string | null
  factor_conversion: number
  precio_compra?: number | null
  precio_venta: number
  es_principal: boolean
  estado: boolean
}

export type Producto = {
  id: number
  categoria_id: number
  marca_id?: number | null
  laboratorio_id?: number | null
  principio_activo_id?: number | null
  principios_activos_ids?: number[]
  accion_terapeutica_id?: number | null
  afectacion_igv_id?: number | null
  codigo_interno: string
  nombre: string
  descripcion?: string | null
  concentracion?: string | null
  requiere_receta: boolean
  maneja_lote: boolean
  maneja_vencimiento: boolean
  afecto_igv: boolean
  estado: boolean
  categoria?: Categoria | null
  marca?: Marca | null
  laboratorio?: Laboratorio | null
  principio_activo?: PrincipioActivo | null
  principios_activos?: PrincipioActivo[]
  accion_terapeutica?: AccionTerapeutica | null
  afectacion_igv?: AfectacionIgv | null
  presentaciones?: ProductoPresentacion[]
  presentacion_principal?: ProductoPresentacion | null
  created_at?: string
  updated_at?: string
}

export type ProductoPayload = {
  codigo_interno?: string | null
  nombre: string
  descripcion?: string | null
  concentracion?: string | null
  categoria_id: number
  marca_id?: number | null
  laboratorio_id?: number | null
  principio_activo_id?: number | null
  principios_activos?: number[]
  accion_terapeutica_id?: number | null
  afectacion_igv_id: number
  requiere_receta: boolean
  maneja_lote: boolean
  maneja_vencimiento: boolean
  afecto_igv?: boolean
  estado: boolean
  presentaciones: ProductoPresentacion[]
}

export type PaginatedResponse<T> = {
  data: T[]
  links?: { first?: string | null; last?: string | null; prev?: string | null; next?: string | null }
  meta?: { current_page: number; from: number | null; last_page: number; per_page: number; to: number | null; total: number }
}

export type ProductoFilters = {
  buscar?: string
  categoria_id?: string
  estado?: string
  page?: number
  per_page?: number
}

export type ProductoCatalogos = {
  categorias: Categoria[]
  marcas: Marca[]
  laboratorios: Laboratorio[]
  principiosActivos: PrincipioActivo[]
  accionesTerapeuticas: AccionTerapeutica[]
  unidadesMedida: UnidadMedida[]
  afectacionesIgv: AfectacionIgv[]
}

export type ProductoConfiguracion = {
  id: number
  tenant_id: number
  empresa_id: number
  autogenerar_codigo_interno: boolean
  prefijo_codigo_interno?: string | null
  ultimo_correlativo_codigo_interno: number
  autogenerar_codigo_barra: boolean
  prefijo_codigo_barra?: string | null
  ultimo_correlativo_codigo_barra: number
  estado: boolean
}

export type ProductoConfiguracionPayload = {
  autogenerar_codigo_interno?: boolean
  prefijo_codigo_interno?: string | null
  autogenerar_codigo_barra?: boolean
  prefijo_codigo_barra?: string | null
}
