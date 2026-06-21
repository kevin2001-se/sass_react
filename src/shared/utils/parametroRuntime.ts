type RuntimeSistemaParametros = {
  moneda_default?: string
  decimales_montos?: number
}

const STORAGE_KEY = "saas.parametros.sistema"

export function setRuntimeSistemaParametros(values: RuntimeSistemaParametros) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
}

export function getRuntimeSistemaParametros(): Required<RuntimeSistemaParametros> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as RuntimeSistemaParametros
    return {
      moneda_default: parsed.moneda_default || "PEN",
      decimales_montos: Number.isFinite(Number(parsed.decimales_montos)) ? Number(parsed.decimales_montos) : 2,
    }
  } catch {
    return { moneda_default: "PEN", decimales_montos: 2 }
  }
}