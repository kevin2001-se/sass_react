import type { PosState } from "@/modules/pos/types/pos.types"

export const selectPosItems = (state: PosState) => state.items
export const selectPosTotals = (state: PosState) => ({
  subtotal: state.subtotal,
  totalIgv: state.totalIgv,
  totalDescuento: state.totalDescuento,
  total: state.total,
  totalItems: state.totalItems,
  cantidadProductos: state.cantidadProductos,
})
export const selectPosCliente = (state: PosState) => state.cliente
export const selectPosPagos = (state: PosState) => state.pagos
export const selectCanRegisterSale = (state: PosState) => state.items.length > 0 && state.puedeCobrar
export const selectCartCount = (state: PosState) => state.items.length
export const selectLastSale = (state: PosState) => state.lastSale