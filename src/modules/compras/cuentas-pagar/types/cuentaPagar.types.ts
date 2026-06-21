import type { Compra, PaginatedResponse } from "@/modules/compras/compras/types/compra.types"
import type { Proveedor } from "@/modules/compras/proveedores/types/proveedor.types"

export type CuentaPagarEstado = "PENDIENTE" | "PARCIAL" | "PAGADO" | "PAGADA" | "VENCIDO" | "ANULADO" | "ANULADA"

export type CuentaPagarFilters = {
  proveedor_id?: string
  fecha_inicio?: string
  fecha_fin?: string
  estado?: string
  vencidas?: boolean
  page?: number
  per_page?: number
}

export type CuentaPagar = {
  id: number
  proveedor_id: number
  proveedor?: Proveedor | null
  compra_id: number
  compra?: Compra | null
  fecha_emision: string
  fecha_vencimiento?: string | null
  monto_total: number | string
  monto_pagado: number | string
  saldo: number | string
  saldo_pendiente: number | string
  estado: CuentaPagarEstado
  estado_registrado?: CuentaPagarEstado
  observacion?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type CuentaPagarResponse = CuentaPagar | { data: CuentaPagar }
export type { PaginatedResponse }