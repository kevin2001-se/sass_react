import { z } from "zod"

export const metodoPagoCajaSchema = z.enum(["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"], {
  message: "Seleccione un método de pago.",
})

export const aperturarCajaSchema = z.object({
  monto_apertura: z.coerce.number().min(0, "El monto de apertura debe ser mayor o igual a 0."),
  observacion_apertura: z.string().optional().nullable(),
})

export const cerrarCajaSchema = z.object({
  monto_cierre_real: z.coerce.number().min(0, "El monto real debe ser mayor o igual a 0."),
  observacion_cierre: z.string().optional().nullable(),
})

export const registrarMovimientoCajaSchema = z.object({
  metodo_pago: metodoPagoCajaSchema,
  concepto: z.string().min(2, "Ingrese un concepto."),
  monto: z.coerce.number().gt(0, "El monto debe ser mayor a 0."),
  observacion: z.string().optional().nullable(),
})

export type AperturarCajaFormValues = z.infer<typeof aperturarCajaSchema>
export type CerrarCajaFormValues = z.infer<typeof cerrarCajaSchema>
export type RegistrarMovimientoCajaFormValues = z.infer<typeof registrarMovimientoCajaSchema>
