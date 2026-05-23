import { z } from "zod"

export const resumenDiarioSchema = z.object({
  fecha_resumen: z.string().min(1, "Selecciona la fecha"),
  incluir_boletas: z.boolean().default(true),
  incluir_notas_credito: z.boolean().default(true),
  incluir_notas_debito: z.boolean().default(true),
})

export type ResumenDiarioFormValues = z.infer<typeof resumenDiarioSchema>