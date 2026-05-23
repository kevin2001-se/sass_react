import { z } from "zod"

export const catalogoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().nullable().optional(),
  estado: z.boolean(),
})

export const unidadMedidaSchema = z.object({
  codigo: z.string().min(1, "El código es obligatorio").max(10, "Máximo 10 caracteres"),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  simbolo: z.string().min(1, "El símbolo es obligatorio").max(20, "Máximo 20 caracteres"),
  descripcion: z.string().nullable().optional(),
  estado: z.boolean(),
})

export type CatalogoFormValues = z.infer<typeof catalogoSchema>
export type UnidadMedidaFormValues = z.infer<typeof unidadMedidaSchema>
export type CatalogoAnyFormValues = CatalogoFormValues | UnidadMedidaFormValues
