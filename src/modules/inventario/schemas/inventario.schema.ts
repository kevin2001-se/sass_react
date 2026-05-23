import { z } from "zod"

const requiredId = z.coerce.number().min(1, "Seleccione una opción.")
const nullableId = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) return null
  return Number(value)
}, z.number().min(1).nullable())

export const inventarioMovimientoSchema = z.object({
  producto_id: requiredId,
  producto_presentacion_id: requiredId,
  lote_id: nullableId,
  cantidad_presentacion: z.coerce.number().gt(0, "La cantidad debe ser mayor a 0."),
  motivo: z.string().min(2, "Ingrese un motivo."),
  observacion: z.string().optional().nullable(),
})

export const inventarioAjusteSchema = inventarioMovimientoSchema.extend({
  tipo_ajuste: z.enum(["POSITIVO", "NEGATIVO"], {
    message: "Seleccione el tipo de ajuste.",
  }),
})

export const loteSchema = z.object({
  producto_id: requiredId,
  codigo_lote: z.string().min(1, "Ingrese el código de lote."),
  fecha_vencimiento: z.string().optional().nullable(),
  estado: z.boolean(),
})

export type InventarioMovimientoFormValues = z.infer<typeof inventarioMovimientoSchema>
export type InventarioAjusteFormValues = z.infer<typeof inventarioAjusteSchema>
export type LoteFormValues = z.infer<typeof loteSchema>
