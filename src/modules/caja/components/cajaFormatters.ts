import type { CajaMetodoPago, CajaTipoMovimiento } from "@/modules/caja/types/caja.types"

export function formatCurrency(value?: number | string | null) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(Number(value ?? 0))
}

export function formatDateTime(value?: string | null) {
  if (!value) return "-"
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value.replace(" ", "T")))
}

export function formatMetodoPago(value?: CajaMetodoPago | string | null) {
  if (!value) return "-"
  return value.replace("_", " ")
}

export function formatTipoMovimiento(value?: CajaTipoMovimiento | string | null) {
  if (!value) return "-"
  return value.replaceAll("_", " ")
}
