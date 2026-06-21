import { getRuntimeSistemaParametros } from "@/shared/utils/parametroRuntime"
export function formatCurrency(value?: number | null) {
  const { moneda_default, decimales_montos } = getRuntimeSistemaParametros()
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: moneda_default,
    minimumFractionDigits: decimales_montos,
    maximumFractionDigits: decimales_montos,
  }).format(value ?? 0)
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Sin fecha"
  }

  const normalizedValue = value.replace(" ", "T")
  const date = new Date(normalizedValue)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}
