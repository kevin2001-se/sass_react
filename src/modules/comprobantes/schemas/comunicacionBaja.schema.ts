import { z } from "zod"

export const comunicacionBajaSchema = z.object({
  fecha_baja: z.string().min(1, "Selecciona la fecha"),
  comprobante_electronico_id: z.coerce.number().min(1, "Ingresa el comprobante"),
  motivo_baja: z.string().min(3, "Ingresa el motivo de baja"),
})

export type ComunicacionBajaFormValues = z.infer<typeof comunicacionBajaSchema>