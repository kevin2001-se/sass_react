import type { PosCliente } from "@/modules/pos/types/posCliente.types"
export type { PosCliente } from "@/modules/pos/types/posCliente.types"
import type { PosProductoLote, PosProductoPresentacion, PosProductoSearchItem } from "@/modules/pos/types/posProducto.types"

export type PosTipoComprobante = "NOTA_VENTA" | "BOLETA" | "FACTURA"
export type PosTipoVenta = "CONTADO" | "CREDITO"
export type PosMetodoPago = "EFECTIVO" | "YAPE" | "PLIN" | "TARJETA" | "TRANSFERENCIA"
export type PosSunatEstado = "PENDIENTE" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "ERROR" | "DADO_DE_BAJA" | "NO_APLICA"
export type PosDocumentoFormato = "PDF_A4" | "TICKET_80" | "TICKET_58" | "XML" | "CDR"
export type PosDownloadAction = "download" | "open"

export type PosCartItem = {
  itemKey: string
  producto_id: number
  producto_presentacion_id: number
  lote_id?: number | null
  codigo_interno: string
  codigo_barra?: string | null
  producto_nombre: string
  presentacion_nombre: string
  lote_codigo?: string | null
  fecha_vencimiento?: string | null
  requiere_receta: boolean
  maneja_lote: boolean
  maneja_vencimiento: boolean
  afecto_igv: boolean
  cantidad_presentacion: number
  factor_conversion: number
  cantidad_base: number
  precio_unitario: number
  descuento: number
  stock_disponible_base: number
  subtotal: number
  igv: number
  total: number
}

export type AddPosItemPayload = {
  producto: PosProductoSearchItem
  presentacion: PosProductoPresentacion
  lote?: PosProductoLote | null
  cantidad_presentacion?: number
}

export type PosPago = {
  id: string
  metodo_pago: PosMetodoPago
  monto: number
  referencia?: string | null
}

export type PosPaymentValidationResult = {
  ok: boolean
  message?: string
  status?: "PENDIENTE" | "COMPLETO" | "VUELTO" | "ERROR" | "CREDITO"
}

export type PosVentaPayload = {
  cliente_id: number | null
  tipo_comprobante: PosTipoComprobante
  tipo_venta: PosTipoVenta
  detalles: Array<{
    producto_id: number
    producto_presentacion_id: number
    lote_id: number | null
    cantidad_presentacion: number
    descuento: number
  }>
  pagos: Array<{
    metodo_pago: PosMetodoPago
    monto: number
    referencia: string | null
  }>
  observacion: string | null
}

export type PosComprobanteElectronico = {
  id: number
  venta_id?: number | null
  tipo_comprobante: string
  numero_comprobante: string
  estado_sunat: PosSunatEstado
  codigo_respuesta?: string | null
  mensaje_respuesta?: string | null
  hash?: string | null
  qr_text?: string | null
  tiene_xml?: boolean
  tiene_cdr?: boolean
  tiene_pdf_a4?: boolean
  tiene_ticket_80?: boolean
  tiene_ticket_58?: boolean
}

export type PosSaleResponse = {
  id: number
  numero_comprobante: string
  tipo_comprobante: PosTipoComprobante
  tipo_venta: PosTipoVenta
  total: number
  monto_pagado?: number | string | null
  saldo_pendiente?: number | string | null
  cuenta_por_cobrar?: { id: number; monto_total?: number | string; monto_pagado?: number | string; saldo?: number | string; saldo_pendiente?: number | string; estado?: string } | null
  estado: string
  comprobante_electronico?: PosComprobanteElectronico | null
}


export type PosSuspendedSale = {
  id: string
  user_id: number
  tienda_id: number
  cliente: PosCliente | null
  items: PosCartItem[]
  pagos: PosPago[]
  tipoComprobante: PosTipoComprobante
  tipoVenta: PosTipoVenta
  observacion: string
  subtotal: number
  totalIgv: number
  totalDescuento: number
  total: number
  created_at: string
  updated_at: string
}
export type PosVentaRegistrada = PosSaleResponse

export type PosDraftSale = {
  cliente: PosCliente | null
  items: PosCartItem[]
  pagos: PosPago[]
  tipoComprobante: PosTipoComprobante
  tipoVenta: PosTipoVenta
  observacion: string
  updated_at?: string
}

export type PosCartTotals = {
  subtotal: number
  totalIgv: number
  totalDescuento: number
  total: number
  totalItems: number
  cantidadProductos: number
}

export type PosPaymentTotals = {
  totalPagado: number
  saldoPendiente: number
  vuelto: number
  puedeCobrar: boolean
  paymentError: string | null
}

export type PosState = PosCartTotals & PosPaymentTotals & {
  cliente: PosCliente | null
  items: PosCartItem[]
  pagos: PosPago[]
  tipoComprobante: PosTipoComprobante
  tipoVenta: PosTipoVenta
  observacion: string
  lastSale: PosVentaRegistrada | null
  suspendedSaleId: string | null
  suspendedSales: PosSuspendedSale[]
}



