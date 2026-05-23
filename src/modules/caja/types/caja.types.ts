import type { PaginatedResponse } from "@/modules/productos/types/producto.types"
import type { User } from "@/shared/types/auth.types"

export type CajaEstado = "ABIERTA" | "CERRADA"
export type CajaMetodoPago = "EFECTIVO" | "YAPE" | "PLIN" | "TARJETA" | "TRANSFERENCIA"
export type CajaTipoMovimiento = "APERTURA" | "INGRESO" | "EGRESO" | "VENTA" | "ANULACION_VENTA" | "AJUSTE"

export type Caja = {
  id: number
  tienda_id: number
  user_apertura_id: number
  user_apertura?: User | null
  user_cierre_id?: number | null
  user_cierre?: User | null
  fecha_apertura: string
  fecha_cierre?: string | null
  monto_apertura: number
  monto_cierre_sistema: number
  monto_cierre_real?: number | null
  diferencia?: number | null
  estado: CajaEstado
  observacion_apertura?: string | null
  observacion_cierre?: string | null
  movimientos?: CajaMovimiento[]
  created_at?: string
  updated_at?: string
}

export type CajaMovimiento = {
  id: number
  caja_id: number
  user_id: number
  user?: User | null
  tipo_movimiento: CajaTipoMovimiento
  metodo_pago: CajaMetodoPago
  concepto: string
  monto: number
  referencia_tipo?: string | null
  referencia_id?: number | null
  observacion?: string | null
  created_at?: string
}

export type ArqueoCaja = {
  monto_apertura: number
  ingresos_efectivo: number
  ingresos_yape: number
  ingresos_plin: number
  ingresos_tarjeta: number
  ingresos_transferencia: number
  total_ingresos: number
  total_egresos: number
  saldo_sistema: number
  monto_real?: number | null
  diferencia?: number | null
}

export type AperturarCajaPayload = {
  monto_apertura: number
  observacion_apertura?: string | null
}

export type CerrarCajaPayload = {
  monto_cierre_real: number
  observacion_cierre?: string | null
}

export type RegistrarMovimientoCajaPayload = {
  metodo_pago: CajaMetodoPago
  concepto: string
  monto: number
  observacion?: string | null
}

export type CajaFilters = {
  fecha_inicio?: string
  fecha_fin?: string
  estado?: string
  page?: number
  per_page?: number
}

export type CajaMovimientoFilters = {
  caja_id?: number
  tipo_movimiento?: string
  metodo_pago?: string
  page?: number
  per_page?: number
}

export type CerrarCajaResponse = {
  caja: Caja
  arqueo: ArqueoCaja
}

export type CajaPaginated<T> = PaginatedResponse<T>
