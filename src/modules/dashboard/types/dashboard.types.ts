export type CajaAbierta = {
  id: number
  monto_apertura: number
  fecha_apertura: string
}

export type DashboardResumen = {
  ventas_dia: number
  compras_dia: number
  utilidad_estimada: number
  productos_bajo_stock: number
  productos_por_vencer: number
  cuentas_por_cobrar_vencidas: number
  cuentas_por_pagar_vencidas: number
  caja_abierta: CajaAbierta | null
}
