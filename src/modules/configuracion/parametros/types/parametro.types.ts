export type ParametroTipo = "boolean" | "string" | "integer" | "decimal" | "json"
export type ParametroGrupo = "ventas" | "pos" | "inventario" | "compras" | "sunat" | "sistema"

export type Parametro = {
  clave: string
  valor: unknown
  tipo: ParametroTipo
  grupo: ParametroGrupo
  descripcion?: string | null
  estado: boolean
}

export type ParametrosAgrupados = Partial<Record<ParametroGrupo, Parametro[]>>

export type ActualizarParametrosPayload = {
  parametros: Array<{
    clave: string
    valor: unknown
  }>
}

export type ActualizarParametrosResponse = {
  success: boolean
  message: string
  data?: Parametro[]
}

export type ParametrosFormValues = {
  values: Record<string, unknown>
}

export const parametroGrupos: Array<{ value: ParametroGrupo; label: string }> = [
  { value: "ventas", label: "Ventas" },
  { value: "pos", label: "POS" },
  { value: "inventario", label: "Inventario" },
  { value: "compras", label: "Compras" },
  { value: "sunat", label: "SUNAT" },
  { value: "sistema", label: "Sistema" },
]