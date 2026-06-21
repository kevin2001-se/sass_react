export type CxcEstado = "PENDIENTE" | "PARCIAL" | "PAGADO" | "PAGADA" | "VENCIDO" | "VENCIDA" | "ANULADO" | "ANULADA"
export type MetodoPagoCliente = "EFECTIVO" | "YAPE" | "PLIN" | "TARJETA" | "TRANSFERENCIA"

export type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number }
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta }

export type CxcCliente = { id: number; nombres?: string | null; razon_social?: string | null; tipo_documento?: string | null; numero_documento?: string | null }
export type CxcVenta = { id: number; tipo_comprobante?: string | null; numero_comprobante?: string | null; tipo_venta?: string | null; total?: number | string | null; monto_pagado?: number | string | null; saldo_pendiente?: number | string | null }

export type CuentaCobrar = {
  id: number
  cliente_id: number
  cliente?: CxcCliente | null
  venta_id: number
  venta?: CxcVenta | null
  monto_total: number | string
  monto_pagado: number | string
  saldo?: number | string | null
  saldo_pendiente?: number | string | null
  fecha_emision?: string | null
  fecha_vencimiento?: string | null
  estado: CxcEstado | string
  observacion?: string | null
  pagos?: PagoCliente[]
}

export type PagoCliente = {
  id: number
  cuenta_por_cobrar_id: number
  cuenta_por_cobrar?: CuentaCobrar | null
  cliente_id?: number | null
  cliente?: CxcCliente | null
  venta_id?: number | null
  venta?: CxcVenta | null
  caja_id?: number | null
  user_id?: number | null
  metodo_pago: MetodoPagoCliente | string
  monto: number | string
  fecha_pago?: string | null
  referencia?: string | null
  observacion?: string | null
  estado: string
  anulado_by?: number | null
  anulado_at?: string | null
}

export type CuentaCobrarFilters = { cliente_id?: number | string; estado?: string; fecha_inicio?: string; fecha_fin?: string; vencidas?: boolean; numero_comprobante?: string; page?: number; per_page?: number }
export type PagoClienteFilters = { cliente_id?: number | string; cuenta_por_cobrar_id?: number | string; metodo_pago?: string; fecha_inicio?: string; fecha_fin?: string; page?: number; per_page?: number }
export type RegistrarPagoClientePayload = { cuenta_por_cobrar_id?: number; metodo_pago: MetodoPagoCliente; monto: number; fecha_pago: string; referencia?: string | null; observacion?: string | null }
export type AnularPagoClientePayload = { motivo: string }

export function toNumber(value: number | string | null | undefined) { const n = Number(value ?? 0); return Number.isFinite(n) ? n : 0 }
export function getSaldoCuenta(cuenta: Pick<CuentaCobrar, "saldo" | "saldo_pendiente">) { return toNumber(cuenta.saldo_pendiente ?? cuenta.saldo) }
export function clienteNombre(cliente?: CxcCliente | null) { return cliente?.razon_social || cliente?.nombres || "Cliente" }
