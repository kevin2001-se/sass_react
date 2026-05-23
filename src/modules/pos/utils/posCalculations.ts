import type { PosCartItem, PosCartTotals } from "@/modules/pos/types/pos.types"

const IGV_RATE = 0.18

export function roundMoney(value: number) {
  return Number(value.toFixed(2))
}

export function formatQuantity(value?: number | null) {
  return Number(value ?? 0).toLocaleString("es-PE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
}

export function buildCartItemKey(productoId: number, presentacionId: number, loteId?: number | null) {
  return `${productoId}-${presentacionId}-${loteId ?? "sin-lote"}`
}

export function isLotExpired(fechaVencimiento?: string | null) {
  if (!fechaVencimiento) return false
  return new Date(`${fechaVencimiento}T00:00:00`) < new Date(new Date().toDateString())
}

export function isLotNearExpiration(fechaVencimiento?: string | null, days = 30) {
  if (!fechaVencimiento || isLotExpired(fechaVencimiento)) return false
  const today = new Date(new Date().toDateString()).getTime()
  const expires = new Date(`${fechaVencimiento}T00:00:00`).getTime()
  return Math.ceil((expires - today) / (1000 * 60 * 60 * 24)) <= days
}

export function calculateItemTotals(item: PosCartItem, aplicarIgv = true): PosCartItem {
  const cantidadPresentacion = Math.max(Number(item.cantidad_presentacion || 0), 0)
  const factorConversion = Number(item.factor_conversion || 1)
  const precioUnitario = Number(item.precio_unitario || 0)
  const importeBruto = roundMoney(cantidadPresentacion * precioUnitario)
  const descuento = Math.min(Math.max(Number(item.descuento || 0), 0), importeBruto)
  const total = roundMoney(Math.max(importeBruto - descuento, 0))
  const debeCalcularIgv = aplicarIgv && item.afecto_igv
  const subtotal = debeCalcularIgv ? roundMoney(total / (1 + IGV_RATE)) : total
  const igv = debeCalcularIgv ? roundMoney(total - subtotal) : 0

  return {
    ...item,
    cantidad_presentacion: cantidadPresentacion,
    cantidad_base: Number((cantidadPresentacion * factorConversion).toFixed(4)),
    descuento,
    subtotal,
    igv,
    total,
  }
}


export function getUsedStockBaseInCart(items: PosCartItem[], productoId: number, loteId?: number | null, excludeItemKey?: string) {
  return items
    .filter((item) => item.producto_id === productoId)
    .filter((item) => (item.lote_id ?? null) === (loteId ?? null))
    .filter((item) => item.itemKey !== excludeItemKey)
    .reduce((sum, item) => sum + item.cantidad_base, 0)
}
export function calculateCartTotals(items: PosCartItem[]): PosCartTotals {
  return {
    subtotal: roundMoney(items.reduce((sum, item) => sum + item.subtotal, 0)),
    totalIgv: roundMoney(items.reduce((sum, item) => sum + item.igv, 0)),
    totalDescuento: roundMoney(items.reduce((sum, item) => sum + item.descuento, 0)),
    total: roundMoney(items.reduce((sum, item) => sum + item.total, 0)),
    totalItems: items.reduce((sum, item) => sum + item.cantidad_presentacion, 0),
    cantidadProductos: items.length,
  }
}



