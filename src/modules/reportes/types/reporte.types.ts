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

export type ReporteFilters = {
  fecha_inicio?: string
  fecha_fin?: string
  estado?: string
  producto_id?: number | string
  cliente_id?: number | string
  proveedor_id?: number | string
  usuario_id?: number | string
  tipo_comprobante?: string
  page?: number
  per_page?: number
}

export type ResumenVentas = {
  cantidad_ventas: number
  total_vendido: number | string
  total_igv: number | string
  total_descuento: number | string
}

export type MetodoPagoResumen = {
  metodo_pago: string
  total: number | string
}

export type MetodosPagoResponse = {
  total: number | string
  metodos: MetodoPagoResumen[]
}

export type ProductoRanking = {
  producto_id: number
  producto: string
  cantidad_base: number | string
  total_vendido?: number | string
  total_comprado?: number | string
}

export type ProductosRankingResponse = {
  productos: ProductoRanking[]
}

export type ResumenCompras = {
  cantidad_compras: number
  total_comprado: number | string
  total_igv: number | string
  total_descuento: number | string
}

export type StockValorizadoItem = {
  producto_id: number
  producto: string
  cantidad_base: number | string
  precio_referencia: number | string
  valor_estimado: number | string
}

export type StockValorizadoResponse = {
  total_valorizado: number | string
  items: StockValorizadoItem[]
}

export type ResumenCaja = {
  ingresos: number | string
  egresos: number | string
  saldo: number | string
}

export type FlujoFinanciero = {
  ingresos: number | string
  egresos: number | string
  saldo: number | string
  cuentas_por_cobrar_pendiente: number | string
  cuentas_por_pagar_pendiente: number | string
}

export type GenericRecord = Record<string, any>

export function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatCurrency(value: number | string | null | undefined) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(toNumber(value))
}

export function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("es-PE").format(date)
}
