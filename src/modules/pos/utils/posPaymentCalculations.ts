import type { PosCliente, PosMetodoPago, PosPago, PosPaymentValidationResult, PosTipoVenta } from "@/modules/pos/types/pos.types"

export function roundPayment(value: number) {
  return Number(value.toFixed(2))
}

export function calculateTotalPagado(pagos: PosPago[]) {
  return roundPayment(pagos.reduce((sum, pago) => sum + Number(pago.monto || 0), 0))
}

export function calculateSaldoPendiente(total: number, pagos: PosPago[], tipoVenta: PosTipoVenta = "CONTADO") {
  const pagado = calculateTotalPagado(pagos)
  if (tipoVenta === "CREDITO") return roundPayment(Math.max(total - pagado, 0))
  return roundPayment(Math.max(total - Math.min(pagado, total), 0))
}

export function calculateVuelto(total: number, pagos: PosPago[], tipoVenta: PosTipoVenta = "CONTADO") {
  if (tipoVenta === "CREDITO") return 0
  const nonCashOverpay = pagos.some((pago) => pago.metodo_pago !== "EFECTIVO" && pago.monto > total)
  if (nonCashOverpay) return 0
  const pagado = calculateTotalPagado(pagos)
  return roundPayment(Math.max(pagado - total, 0))
}

export function formatMetodoPago(metodo: PosMetodoPago) {
  const labels: Record<PosMetodoPago, string> = {
    EFECTIVO: "Efectivo",
    YAPE: "Yape",
    PLIN: "Plin",
    TARJETA: "Tarjeta",
    TRANSFERENCIA: "Transferencia",
  }

  return labels[metodo]
}

export function validatePaymentAmount({
  metodoPago,
  monto,
  saldoPendiente,
  tipoVenta,
}: {
  metodoPago: PosMetodoPago
  monto: number
  saldoPendiente: number
  tipoVenta: PosTipoVenta
}): PosPaymentValidationResult {
  if (!Number.isFinite(monto) || monto <= 0) return { ok: false, message: "El monto debe ser mayor a 0.", status: "ERROR" }
  if (tipoVenta === "CREDITO" && monto > saldoPendiente) return { ok: false, message: "El pago inicial no puede ser mayor al total pendiente.", status: "ERROR" }
  if (tipoVenta === "CONTADO" && metodoPago !== "EFECTIVO" && monto > saldoPendiente) {
    return { ok: false, message: "Solo efectivo puede exceder el saldo para calcular vuelto.", status: "ERROR" }
  }
  return { ok: true }
}

export function validatePayments({
  total,
  pagos,
  tipoVenta,
  cliente,
}: {
  total: number
  pagos: PosPago[]
  tipoVenta: PosTipoVenta
  cliente: PosCliente | null
}): PosPaymentValidationResult {
  if (total <= 0) return { ok: false, message: "Agrega productos al carrito.", status: "PENDIENTE" }

  const totalPagado = calculateTotalPagado(pagos)

  if (tipoVenta === "CREDITO") {
    if (!cliente || cliente.es_cliente_varios) {
      return { ok: false, message: "Para venta credito debes seleccionar un cliente real.", status: "ERROR" }
    }
    if (totalPagado > total) return { ok: false, message: "El pago inicial no puede ser mayor al total.", status: "ERROR" }
    return { ok: true, status: totalPagado > 0 ? "CREDITO" : "PENDIENTE" }
  }

  if (totalPagado < total) return { ok: false, message: "Falta completar el pago.", status: "PENDIENTE" }

  const totalNoEfectivo = pagos.filter((pago) => pago.metodo_pago !== "EFECTIVO").reduce((sum, pago) => sum + pago.monto, 0)
  if (totalNoEfectivo > total) {
    return { ok: false, message: "El monto pagado excede el total con metodo no efectivo.", status: "ERROR" }
  }

  const vuelto = calculateVuelto(total, pagos, tipoVenta)
  return { ok: true, status: vuelto > 0 ? "VUELTO" : "COMPLETO" }
}
