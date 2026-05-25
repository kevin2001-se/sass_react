import type { Tienda } from "@/modules/configuracion/tiendas/types/tienda.types"
export type TipoComprobanteSerie = "NOTA_VENTA" | "BOLETA" | "FACTURA" | "NOTA_CREDITO" | "NOTA_DEBITO" | "GUIA_REMISION"
export type SerieComprobante = { id: number; tienda_id: number; tienda?: Pick<Tienda, "id" | "nombre" | "codigo">; tipo_comprobante: TipoComprobanteSerie; serie: string; correlativo_actual: number; estado: boolean }
export type SerieFormValues = { tienda_id: number; tipo_comprobante: TipoComprobanteSerie; serie: string; correlativo_actual: number; estado: boolean }
export type SerieFilters = { tienda_id?: number; tipo_comprobante?: string; estado?: string; page?: number; per_page?: number }
export const tipoComprobanteOptions: { value: TipoComprobanteSerie; label: string }[] = [
  { value: "NOTA_VENTA", label: "Nota de venta" }, { value: "BOLETA", label: "Boleta" }, { value: "FACTURA", label: "Factura" }, { value: "NOTA_CREDITO", label: "Nota de crédito" }, { value: "NOTA_DEBITO", label: "Nota de débito" }, { value: "GUIA_REMISION", label: "Guía de remisión" },
]