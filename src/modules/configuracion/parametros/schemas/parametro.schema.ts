import { z } from "zod"
import type { Parametro, ParametrosFormValues } from "@/modules/configuracion/parametros/types/parametro.types"

export function buildParametrosSchema(parametros: Parametro[]) {
  return z.object({ values: z.record(z.string(), z.unknown()) }).superRefine((data, ctx) => {
    parametros.forEach((parametro) => {
      const value = data.values[parametro.clave]
      const path = ["values", parametro.clave]

      if (parametro.tipo !== "string" && (value === undefined || value === null || value === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path, message: "El valor es requerido." })
        return
      }

      if (parametro.tipo === "integer" && !Number.isInteger(Number(value))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path, message: "Debe ser un numero entero." })
      }

      if (parametro.tipo === "decimal" && Number.isNaN(Number(value))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path, message: "Debe ser un numero decimal." })
      }

      if (parametro.tipo === "json" && typeof value === "string") {
        try {
          JSON.parse(value)
        } catch {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path, message: "Debe ser un JSON valido." })
        }
      }
    })
  })
}

export function parametrosToDefaultValues(parametros: Parametro[]): ParametrosFormValues {
  return {
    values: parametros.reduce<Record<string, unknown>>((acc, parametro) => {
      acc[parametro.clave] = parametro.tipo === "json" ? JSON.stringify(parametro.valor ?? {}, null, 2) : parametro.valor ?? ""
      return acc
    }, {}),
  }
}

export function parametrosToPayload(parametros: Parametro[], values: ParametrosFormValues) {
  return parametros.map((parametro) => {
    const value = values.values[parametro.clave]

    if (parametro.tipo === "integer") return { clave: parametro.clave, valor: Number.parseInt(String(value), 10) }
    if (parametro.tipo === "decimal") return { clave: parametro.clave, valor: Number(value) }
    if (parametro.tipo === "boolean") return { clave: parametro.clave, valor: Boolean(value) }
    if (parametro.tipo === "json") return { clave: parametro.clave, valor: typeof value === "string" ? JSON.parse(value) : value }

    return { clave: parametro.clave, valor: value ?? null }
  })
}