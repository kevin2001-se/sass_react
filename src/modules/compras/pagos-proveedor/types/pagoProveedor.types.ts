import type { CuentaPagar, PaginatedResponse } from "@/modules/compras/cuentas-pagar/types/cuentaPagar.types"
import type { Proveedor } from "@/modules/compras/proveedores/types/proveedor.types"

export type PagoProveedorEstado = "REGISTRADO" | "ANULADO"
export type PagoProveedorMetodo = "EFECTIVO" | "YAPE" | "PLIN" | "TARJETA" | "TRANSFERENCIA"

export type PagoProveedorFilters = {
  proveedor_id?: string
  cuenta_por_pagar_id?: string
  estado?: string
  fecha_inicio?: string
  fecha_fin?: string
  page?: number
  per_page?: number
}

export type PagoProveedorFormValues = {
  cuenta_por_pagar_id: number | null
  metodo_pago: PagoProveedorMetodo
  monto: number
  fecha_pago: string
  referencia?: string | null
  observacion?: string | null
}

export type AnularPagoProveedorPayload = { motivo: string }

export type PagoProveedor = {
  id: number
  cuenta_por_pagar_id: number
  cuenta_por_pagar?: CuentaPagar | null
  proveedor_id: number
  proveedor?: Proveedor | null
  caja_id?: number | null
  metodo_pago: PagoProveedorMetodo
  monto: number | string
  referencia?: string | null
  fecha_pago: string
  observacion?: string | null
  estado: PagoProveedorEstado
  created_by?: number
  creado_por?: { id: number; name: string; email?: string } | null
  anulado_by?: number | null
  anulado_at?: string | null
  created_at?: string | null
}

export type PagoProveedorResponse = PagoProveedor | { data: PagoProveedor }
export type { PaginatedResponse }