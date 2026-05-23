import { z } from "zod"

export const notaElectronicaSchema = z.object({
  comprobante_referencia_id: z.coerce.number().min(1, "Selecciona el comprobante de referencia"),
  motivo_codigo: z.string().min(1, "Selecciona el motivo"),
  motivo_descripcion: z.string().min(2, "Ingresa la descripcion del motivo"),
  afecta_stock: z.boolean().default(false),
  afecta_caja: z.boolean().default(false),
  observacion: z.string().optional(),
})

export type NotaElectronicaFormValues = z.infer<typeof notaElectronicaSchema>