import { getRuntimeSistemaParametros } from "@/shared/utils/parametroRuntime"
import type { CajaMetodoPago, CajaTipoMovimiento } from "@/modules/caja/types/caja.types"

export function formatCurrency(value?: number | string | null) {
  const { moneda_default, decimales_montos } = getRuntimeSistemaParametros()
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: moneda_default,
    minimumFractionDigits: decimales_montos,
    maximumFractionDigits: decimales_montos,
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
