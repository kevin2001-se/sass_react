import { z } from "zod"

export const notaDebitoDetalleSchema = z.object({
  descripcion: z.string().trim().min(1, "La descripcion es obligatoria").max(500, "Maximo 500 caracteres"),
  cantidad: z.coerce.number().gt(0, "La cantidad debe ser mayor a 0"),
  precio_unitario: z.coerce.number().gt(0, "El precio unitario debe ser mayor a 0"),
})

export const notaDebitoSchema = z.object({
  comprobante_id: z.coerce.number().gt(0, "Seleccione un comprobante"),
  motivo_codigo: z.string().trim().min(1, "Seleccione un motivo"),
  motivo_descripcion: z.string().trim().nullable().optional(),
  afecta_caja: z.boolean().default(false),
  metodo_pago_cobro: z.string().nullable().optional(),
  observacion: z.string().trim().nullable().optional(),
  detalles: z.array(notaDebitoDetalleSchema).min(1, "Agrega al menos un concepto"),
}).superRefine((value, ctx) => {
  if (value.afecta_caja && !value.metodo_pago_cobro) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["metodo_pago_cobro"], message: "Seleccione el metodo de cobro" })
  }
})

export type NotaDebitoFormValues = z.infer<typeof notaDebitoSchema>
export type NotaDebitoDetalleFormValues = z.infer<typeof notaDebitoDetalleSchema>