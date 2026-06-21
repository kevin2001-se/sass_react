import { z } from "zod"

export const pagoClienteSchema = z.object({
  metodo_pago: z.enum(["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"], { message: "Seleccione metodo de pago." }),
  monto: z.number().gt(0, "El monto debe ser mayor a 0."),
  fecha_pago: z.string().min(1, "La fecha de pago es obligatoria."),
  referencia: z.string().max(255).optional().nullable(),
  observacion: z.string().optional().nullable(),
})

export const anularPagoClienteSchema = z.object({
  motivo: z.string().min(3, "Ingrese un motivo.").max(500, "El motivo es demasiado largo."),
})

export type PagoClienteFormValues = z.infer<typeof pagoClienteSchema>
export type AnularPagoClienteFormValues = z.infer<typeof anularPagoClienteSchema>
