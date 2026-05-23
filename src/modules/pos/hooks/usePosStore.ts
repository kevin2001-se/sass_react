import { create } from "zustand"

import type { AddPosItemPayload, PosCartItem, PosCliente, PosDraftSale, PosMetodoPago, PosPago, PosPaymentValidationResult, PosState, PosSuspendedSale, PosTipoComprobante, PosTipoVenta, PosVentaPayload, PosVentaRegistrada } from "@/modules/pos/types/pos.types"
import { CLIENTE_VARIOS } from "@/modules/pos/types/posCliente.types"
import { buildCartItemKey, calculateCartTotals, calculateItemTotals, getUsedStockBaseInCart, isLotExpired } from "@/modules/pos/utils/posCalculations"
import { calculateSaldoPendiente, calculateTotalPagado, calculateVuelto, validatePaymentAmount, validatePayments } from "@/modules/pos/utils/posPaymentCalculations"
import { useAuthStore } from "@/shared/stores/auth.store"

type PosActionResult = { ok: boolean; message?: string }
type AddItemInput = PosCartItem | AddPosItemPayload
type UpdatePagoData = Partial<Pick<PosPago, "metodo_pago" | "monto" | "referencia">>

type PosActions = {
  setCliente: (cliente: PosCliente | null) => void
  clearCliente: () => void
  setClienteVarios: () => void
  validateClienteForComprobante: () => PosActionResult
  addItem: (payload: AddItemInput) => PosActionResult
  increaseItem: (itemKey: string) => PosActionResult
  decreaseItem: (itemKey: string) => PosActionResult
  updateItemQuantity: (itemKey: string, quantity: number) => PosActionResult
  updateItemDiscount: (itemKey: string, discount: number) => PosActionResult
  removeItem: (itemKey: string) => void
  clearCart: () => void
  calculateTotals: () => void
  validateStock: (itemKey: string) => PosActionResult
  getItemByKey: (itemKey: string) => PosCartItem | undefined
  setTipoComprobante: (tipo: PosTipoComprobante) => void
  setTipoVenta: (tipo: PosTipoVenta) => void
  setObservacion: (observacion: string) => void
  addPago: (pago: PosPago) => PosActionResult
  updatePago: (pagoId: string, data: UpdatePagoData) => PosActionResult
  removePago: (id: string) => void
  clearPagos: () => void
  calculatePaymentTotals: () => void
  validatePayments: () => PosPaymentValidationResult
  setLastSale: (sale: PosVentaRegistrada | null) => void
  suspendCurrentSale: () => PosActionResult
  getSuspendedSales: () => PosSuspendedSale[]
  resumeSuspendedSale: (id: string) => PosActionResult
  deleteSuspendedSale: (id: string) => PosActionResult
  clearSuspendedSaleId: () => void
  restoreDraft: (draft: PosDraftSale) => void
  resetAfterSale: () => void
  buildVentaPayload: () => PosVentaPayload
  validateBeforeRegister: (cajaAbierta?: boolean) => PosActionResult
  setMetodoPagoRapido: (metodo: PosMetodoPago) => PosActionResult
}

const emptyTotals = {
  subtotal: 0,
  totalIgv: 0,
  totalDescuento: 0,
  total: 0,
  totalItems: 0,
  cantidadProductos: 0,
}

const emptyPaymentTotals = {
  totalPagado: 0,
  saldoPendiente: 0,
  vuelto: 0,
  puedeCobrar: false,
  paymentError: null,
}

const initialState: PosState = {
  cliente: null,
  items: [],
  pagos: [],
  tipoComprobante: "NOTA_VENTA",
  tipoVenta: "CONTADO",
  observacion: "",
  lastSale: null,
  suspendedSaleId: null,
  suspendedSales: [],
  ...emptyTotals,
  ...emptyPaymentTotals,
}

const SUSPENDED_SALES_KEY = "pos-suspended-sales"
const POS_DRAFT_CLEAR_EVENT = "pos:draft-clear"

function getScope() {
  const auth = useAuthStore.getState()
  return {
    userId: auth.user?.id ?? null,
    tiendaId: auth.tiendaActiva?.id ?? null,
  }
}

function readSuspendedSales(): PosSuspendedSale[] {
  try {
    const raw = localStorage.getItem(SUSPENDED_SALES_KEY)
    return raw ? JSON.parse(raw) as PosSuspendedSale[] : []
  } catch {
    return []
  }
}

function writeSuspendedSales(sales: PosSuspendedSale[]) {
  localStorage.setItem(SUSPENDED_SALES_KEY, JSON.stringify(sales))
}

function scopedSuspendedSales() {
  const { userId, tiendaId } = getScope()
  if (!userId || !tiendaId) return []
  return readSuspendedSales().filter((sale) => sale.user_id === userId && sale.tienda_id === tiendaId)
}

function persistSuspendedSale(sale: PosSuspendedSale) {
  const sales = readSuspendedSales().filter((item) => item.id !== sale.id)
  const nextSales = [sale, ...sales]
  writeSuspendedSales(nextSales)
  return nextSales.filter((item) => item.user_id === sale.user_id && item.tienda_id === sale.tienda_id)
}

function removeSuspendedSale(id: string) {
  const nextSales = readSuspendedSales().filter((sale) => sale.id !== id)
  writeSuspendedSales(nextSales)
  return scopedSuspendedSales()
}
function success(): PosActionResult {
  return { ok: true }
}

function fail(message: string): PosActionResult {
  return { ok: false, message }
}

function validateItem(item: PosCartItem): PosActionResult {
  if (item.cantidad_presentacion <= 0) return fail("La cantidad debe ser mayor a 0.")
  if (item.cantidad_base > item.stock_disponible_base) return fail("No hay stock suficiente.")
  if (item.descuento < 0) return fail("El descuento no puede ser menor a 0.")
  const gross = item.cantidad_presentacion * item.precio_unitario
  if (item.descuento > gross) return fail("El descuento no puede ser mayor que el subtotal del item.")
  if (item.maneja_lote && !item.lote_id) return fail("Seleccione un lote para este producto.")
  if (!item.maneja_lote && item.lote_id) return fail("Este producto no debe tener lote.")
  if (isLotExpired(item.fecha_vencimiento)) return fail("No se puede vender un lote vencido.")
  return success()
}

function paymentTotals(total: number, pagos: PosPago[], tipoVenta: PosTipoVenta, cliente: PosCliente | null) {
  const totalPagado = calculateTotalPagado(pagos)
  const saldoPendiente = calculateSaldoPendiente(total, pagos, tipoVenta)
  const vuelto = calculateVuelto(total, pagos, tipoVenta)
  const validation = validatePayments({ total, pagos, tipoVenta, cliente })

  return {
    totalPagado,
    saldoPendiente,
    vuelto,
    puedeCobrar: validation.ok,
    paymentError: validation.ok ? null : validation.message ?? null,
  }
}

function applyFullState(state: PosState, items = state.items, pagos = state.pagos, tipoVenta = state.tipoVenta, cliente = state.cliente) {
  const aplicaIgv = state.tipoComprobante !== "NOTA_VENTA"
  const normalized = items.map((item) => calculateItemTotals(item, aplicaIgv))
  const cartTotals = calculateCartTotals(normalized)
  const filteredPagos = cartTotals.total > 0 ? pagos : []
  return {
    items: normalized,
    pagos: filteredPagos,
    ...cartTotals,
    ...paymentTotals(cartTotals.total, filteredPagos, tipoVenta, cliente),
  }
}

function isSelectionPayload(payload: AddItemInput): payload is AddPosItemPayload {
  return "producto" in payload && "presentacion" in payload
}

function buildCartItemFromPayload(payload: AddItemInput): PosCartItem {
  if (!isSelectionPayload(payload)) return payload

  const { producto, presentacion, lote } = payload
  const cantidadPresentacion = payload.cantidad_presentacion ?? 1
  const stockBase = producto.maneja_lote ? (lote?.stock_disponible_base ?? 0) : presentacion.stock_disponible_base
  const itemKey = buildCartItemKey(producto.id, presentacion.id, producto.maneja_lote ? lote?.id ?? null : null)

  return calculateItemTotals({
    itemKey,
    producto_id: producto.id,
    producto_presentacion_id: presentacion.id,
    lote_id: producto.maneja_lote ? lote?.id ?? null : null,
    codigo_interno: producto.codigo_interno,
    codigo_barra: presentacion.codigo_barra ?? null,
    producto_nombre: producto.nombre,
    presentacion_nombre: presentacion.nombre,
    lote_codigo: lote?.codigo_lote ?? null,
    fecha_vencimiento: lote?.fecha_vencimiento ?? null,
    requiere_receta: producto.requiere_receta,
    maneja_lote: producto.maneja_lote,
    maneja_vencimiento: producto.maneja_vencimiento,
    afecto_igv: producto.afecto_igv,
    cantidad_presentacion: cantidadPresentacion,
    factor_conversion: presentacion.factor_conversion,
    cantidad_base: cantidadPresentacion * presentacion.factor_conversion,
    precio_unitario: presentacion.precio_venta,
    descuento: 0,
    stock_disponible_base: stockBase,
    subtotal: 0,
    igv: 0,
    total: 0,
  })
}


function validateStockAllocation(items: PosCartItem[], nextItem: PosCartItem): PosActionResult {
  const usedBase = getUsedStockBaseInCart(items, nextItem.producto_id, nextItem.lote_id ?? null, nextItem.itemKey)
  const requestedBase = usedBase + nextItem.cantidad_base

  if (requestedBase > nextItem.stock_disponible_base) {
    return fail("No hay stock suficiente considerando otras presentaciones en el carrito.")
  }

  return success()
}
function validateBeforeRegisterState(state: PosState, cajaAbierta = true): PosActionResult {
  if (!cajaAbierta) return fail("No hay caja abierta. Apertura caja antes de vender.")
  if (state.items.length === 0) return fail("El carrito no puede estar vacio.")

  for (const item of state.items) {
    const itemValidation = validateItem(item)
    if (!itemValidation.ok) return itemValidation
  }

  const clienteValidation = validateClienteForComprobanteState(state)
  if (!clienteValidation.ok) return clienteValidation

  const paymentValidation = validatePayments({ total: state.total, pagos: state.pagos, tipoVenta: state.tipoVenta, cliente: state.cliente })
  if (!paymentValidation.ok) return fail(paymentValidation.message ?? "Revise los pagos de la venta.")

  return success()
}

function validateClienteForComprobanteState(state: PosState): PosActionResult {
  const { cliente, tipoComprobante, total, tipoVenta } = state

  if (tipoVenta === "CREDITO" && (!cliente || cliente.es_cliente_varios)) {
    return fail("Para venta credito debes seleccionar un cliente real.")
  }

  if (tipoComprobante === "NOTA_VENTA") return success()

  if (tipoComprobante === "FACTURA") {
    if (!cliente || cliente.es_cliente_varios || cliente.tipo_documento !== "RUC") return fail("Para factura debe seleccionar un cliente con RUC.")
    return success()
  }

  if (tipoComprobante === "BOLETA" && total > 700) {
    if (!cliente || cliente.es_cliente_varios || !["DNI", "RUC"].includes(cliente.tipo_documento)) return fail("Para boleta mayor a S/ 700 debe seleccionar cliente con DNI o RUC.")
  }

  return success()
}

function normalizePagosForBackend(state: PosState) {
  if (state.tipoVenta !== "CONTADO") {
    return state.pagos.map((pago) => ({
      metodo_pago: pago.metodo_pago,
      monto: Number(pago.monto.toFixed(2)),
      referencia: pago.referencia ?? null,
    }))
  }

  let remaining = Number(state.total.toFixed(2))
  const pagos = []

  for (const pago of state.pagos) {
    if (remaining <= 0) break
    const applied = Math.min(Number(pago.monto || 0), remaining)
    if (applied > 0) {
      pagos.push({
        metodo_pago: pago.metodo_pago,
        monto: Number(applied.toFixed(2)),
        referencia: pago.referencia ?? null,
      })
      remaining = Number((remaining - applied).toFixed(2))
    }
  }

  return pagos
}
function buildVentaPayloadState(state: PosState): PosVentaPayload {
  return {
    cliente_id: state.cliente?.es_cliente_varios ? null : state.cliente?.id ?? null,
    tipo_comprobante: state.tipoComprobante,
    tipo_venta: state.tipoVenta,
    detalles: state.items.map((item) => ({
      producto_id: item.producto_id,
      producto_presentacion_id: item.producto_presentacion_id,
      lote_id: item.lote_id ?? null,
      cantidad_presentacion: item.cantidad_presentacion,
      descuento: item.descuento,
    })),
    pagos: normalizePagosForBackend(state),
    observacion: state.observacion || "Venta desde POS",
  }
}

function validateNewPago(state: PosState, pago: PosPago, existingPagos: PosPago[]) {
  if (state.items.length === 0 || state.total <= 0) return fail("Agrega productos antes de registrar pagos.")
  if (!Number.isFinite(pago.monto) || pago.monto <= 0) return fail("El monto debe ser mayor a 0.")
  if (pago.metodo_pago !== "EFECTIVO" && existingPagos.some((item) => item.metodo_pago === pago.metodo_pago)) {
    return fail(`Ya existe un pago con ${pago.metodo_pago}.`)
  }

  const saldo = state.tipoVenta === "CREDITO"
    ? Math.max(state.total - calculateTotalPagado(existingPagos), 0)
    : Math.max(state.total - Math.min(calculateTotalPagado(existingPagos), state.total), 0)

  return validatePaymentAmount({ metodoPago: pago.metodo_pago, monto: pago.monto, saldoPendiente: saldo, tipoVenta: state.tipoVenta })
}

export const usePosStore = create<PosState & PosActions>((set, get) => ({
  ...initialState,
  setCliente: (cliente) => set((state) => ({ cliente, ...paymentTotals(state.total, state.pagos, state.tipoVenta, cliente) })),
  clearCliente: () => set((state) => ({ cliente: null, ...paymentTotals(state.total, state.pagos, state.tipoVenta, null) })),
  setClienteVarios: () => set((state) => ({ cliente: CLIENTE_VARIOS, ...paymentTotals(state.total, state.pagos, state.tipoVenta, CLIENTE_VARIOS) })),
  validateClienteForComprobante: () => validateClienteForComprobanteState(get()),
  addItem: (payload) => {
    let result = success()
    set((state) => {
      const incoming = buildCartItemFromPayload(payload)
      const itemKey = incoming.itemKey || buildCartItemKey(incoming.producto_id, incoming.producto_presentacion_id, incoming.lote_id)
      const calculatedIncoming = calculateItemTotals({ ...incoming, itemKey })
      const current = state.items.find((item) => item.itemKey === itemKey)
      const nextItem = current
        ? calculateItemTotals({ ...current, cantidad_presentacion: current.cantidad_presentacion + calculatedIncoming.cantidad_presentacion })
        : calculatedIncoming

      result = validateItem(nextItem)
      if (!result.ok) return state
      result = validateStockAllocation(state.items, nextItem)
      if (!result.ok) return state

      const items = current
        ? state.items.map((item) => item.itemKey === itemKey ? nextItem : item)
        : [...state.items, nextItem]

      return applyFullState(state, items)
    })
    return result
  },
  increaseItem: (itemKey) => get().updateItemQuantity(itemKey, (get().getItemByKey(itemKey)?.cantidad_presentacion ?? 0) + 1),
  decreaseItem: (itemKey) => {
    const current = get().getItemByKey(itemKey)
    if (!current) return fail("Item no encontrado.")
    if (current.cantidad_presentacion <= 1) {
      get().removeItem(itemKey)
      return success()
    }
    return get().updateItemQuantity(itemKey, current.cantidad_presentacion - 1)
  },
  updateItemQuantity: (itemKey, quantity) => {
    let result = success()
    set((state) => {
      const current = state.items.find((item) => item.itemKey === itemKey)
      if (!current) {
        result = fail("Item no encontrado.")
        return state
      }
      if (quantity <= 0) return applyFullState(state, state.items.filter((item) => item.itemKey !== itemKey))
      const nextItem = calculateItemTotals({ ...current, cantidad_presentacion: quantity })
      result = validateItem(nextItem)
      if (!result.ok) return state
      result = validateStockAllocation(state.items, nextItem)
      if (!result.ok) return state
      return applyFullState(state, state.items.map((item) => item.itemKey === itemKey ? nextItem : item))
    })
    return result
  },
  updateItemDiscount: (itemKey, discount) => {
    let result = success()
    set((state) => {
      const current = state.items.find((item) => item.itemKey === itemKey)
      if (!current) {
        result = fail("Item no encontrado.")
        return state
      }
      const nextItem = calculateItemTotals({ ...current, descuento: discount })
      result = validateItem(nextItem)
      if (!result.ok) return state
      result = validateStockAllocation(state.items, nextItem)
      if (!result.ok) return state
      return applyFullState(state, state.items.map((item) => item.itemKey === itemKey ? nextItem : item))
    })
    return result
  },
  removeItem: (itemKey) => set((state) => applyFullState(state, state.items.filter((item) => item.itemKey !== itemKey))),
  clearCart: () => { window.dispatchEvent(new Event(POS_DRAFT_CLEAR_EVENT)); set({ items: [], pagos: [], suspendedSaleId: null, ...emptyTotals, ...emptyPaymentTotals }) },
  calculateTotals: () => set((state) => applyFullState(state)),
  validateStock: (itemKey) => {
    const item = get().getItemByKey(itemKey)
    return item ? validateItem(item) : fail("Item no encontrado.")
  },
  getItemByKey: (itemKey) => get().items.find((item) => item.itemKey === itemKey),
  setTipoComprobante: (tipoComprobante) => set((state) => ({ tipoComprobante, ...applyFullState({ ...state, tipoComprobante }) })),
  setTipoVenta: (tipoVenta) => set((state) => ({ tipoVenta, ...applyFullState({ ...state, tipoVenta }, state.items, state.pagos, tipoVenta, state.cliente) })),
  setObservacion: (observacion) => set({ observacion }),
  addPago: (pago) => {
    let result = success()
    set((state) => {
      result = validateNewPago(state, pago, state.pagos)
      if (!result.ok) return state
      return applyFullState(state, state.items, [...state.pagos, pago])
    })
    return result
  },
  updatePago: (pagoId, data) => {
    let result = success()
    set((state) => {
      const current = state.pagos.find((pago) => pago.id === pagoId)
      if (!current) {
        result = fail("Pago no encontrado.")
        return state
      }
      const nextPago = { ...current, ...data, monto: Number(data.monto ?? current.monto) }
      const otherPagos = state.pagos.filter((pago) => pago.id !== pagoId)
      result = validateNewPago(state, nextPago, otherPagos)
      if (!result.ok) return state
      return applyFullState(state, state.items, state.pagos.map((pago) => pago.id === pagoId ? nextPago : pago))
    })
    return result
  },
  removePago: (id) => set((state) => applyFullState(state, state.items, state.pagos.filter((pago) => pago.id !== id))),
  clearPagos: () => set((state) => applyFullState(state, state.items, [])),
  calculatePaymentTotals: () => set((state) => paymentTotals(state.total, state.pagos, state.tipoVenta, state.cliente)),
  validatePayments: () => validatePayments({ total: get().total, pagos: get().pagos, tipoVenta: get().tipoVenta, cliente: get().cliente }),
  setLastSale: (lastSale) => set({ lastSale }),
  suspendCurrentSale: () => {
    const state = get()
    const { userId, tiendaId } = getScope()

    if (!userId || !tiendaId) return fail("Debe seleccionar una tienda activa.")
    if (state.items.length === 0) return fail("No puedes suspender una venta sin productos.")

    const now = new Date().toISOString()
    const sale: PosSuspendedSale = {
      id: state.suspendedSaleId ?? `suspended-${userId}-${tiendaId}-${Date.now()}`,
      user_id: userId,
      tienda_id: tiendaId,
      cliente: state.cliente,
      items: state.items,
      pagos: state.pagos,
      tipoComprobante: state.tipoComprobante,
      tipoVenta: state.tipoVenta,
      observacion: state.observacion,
      subtotal: state.subtotal,
      totalIgv: state.totalIgv,
      totalDescuento: state.totalDescuento,
      total: state.total,
      created_at: state.suspendedSales.find((item) => item.id === state.suspendedSaleId)?.created_at ?? now,
      updated_at: now,
    }

    const scopedSales = persistSuspendedSale(sale)
    window.dispatchEvent(new Event(POS_DRAFT_CLEAR_EVENT))
    set({
      items: [],
      pagos: [],
      cliente: CLIENTE_VARIOS,
      tipoComprobante: "NOTA_VENTA",
      tipoVenta: "CONTADO",
      observacion: "",
      suspendedSaleId: null,
      suspendedSales: scopedSales,
      ...emptyTotals,
      ...emptyPaymentTotals,
    })
    return success()
  },
  getSuspendedSales: () => {
    const sales = scopedSuspendedSales()
    set({ suspendedSales: sales })
    return sales
  },
  resumeSuspendedSale: (id) => {
    const sale = readSuspendedSales().find((item) => item.id === id)
    const { userId, tiendaId } = getScope()

    if (!sale) return fail("Venta suspendida no encontrada.")
    if (!userId || !tiendaId) return fail("Debe seleccionar una tienda activa.")
    if (sale.user_id !== userId || sale.tienda_id !== tiendaId) return fail("La venta suspendida pertenece a otro usuario o tienda.")

    const restoredState = {
      cliente: sale.cliente,
      items: sale.items,
      pagos: sale.pagos,
      tipoComprobante: sale.tipoComprobante,
      tipoVenta: sale.tipoVenta,
      observacion: sale.observacion,
      suspendedSaleId: sale.id,
      suspendedSales: scopedSuspendedSales(),
    }

    set((state) => ({
      ...restoredState,
      ...applyFullState({ ...state, ...restoredState }, sale.items, sale.pagos, sale.tipoVenta, sale.cliente),
    }))
    return success()
  },
  deleteSuspendedSale: (id) => {
    const sales = removeSuspendedSale(id)
    set((state) => ({ suspendedSales: sales, suspendedSaleId: state.suspendedSaleId === id ? null : state.suspendedSaleId }))
    return success()
  },
  clearSuspendedSaleId: () => set({ suspendedSaleId: null }),
  restoreDraft: (draft) => set((state) => {
    const restoredState = {
      cliente: draft.cliente,
      items: draft.items,
      pagos: draft.pagos,
      tipoComprobante: draft.tipoComprobante,
      tipoVenta: draft.tipoVenta,
      observacion: draft.observacion,
      suspendedSaleId: null,
    }

    return {
      ...restoredState,
      ...applyFullState({ ...state, ...restoredState }, draft.items, draft.pagos, draft.tipoVenta, draft.cliente),
    }
  }),
  resetAfterSale: () => {
    window.dispatchEvent(new Event(POS_DRAFT_CLEAR_EVENT))
    set((state) => {
      const sales = state.suspendedSaleId ? removeSuspendedSale(state.suspendedSaleId) : scopedSuspendedSales()
      return { items: [], pagos: [], cliente: CLIENTE_VARIOS, tipoComprobante: "NOTA_VENTA", tipoVenta: "CONTADO", observacion: "", suspendedSaleId: null, suspendedSales: sales, ...emptyTotals, ...emptyPaymentTotals }
    })
  },
  buildVentaPayload: () => buildVentaPayloadState(get()),
  validateBeforeRegister: (cajaAbierta = true) => validateBeforeRegisterState(get(), cajaAbierta),
  setMetodoPagoRapido: (metodo) => {
    const state = get()
    const monto = state.tipoVenta === "CREDITO" ? state.saldoPendiente : Math.max(state.saldoPendiente, 0)
    return get().addPago({ id: `${metodo}-${Date.now()}`, metodo_pago: metodo, monto, referencia: null })
  },
}))















