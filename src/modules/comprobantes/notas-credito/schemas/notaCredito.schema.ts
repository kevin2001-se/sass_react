import { z } from "zod"

const optionalString = z.string().trim().nullable().optional()

export const notaCreditoDetalleSchema = z.object({
  venta_detalle_id: z.coerce.number({ error: "Selecciona un detalle." }).int().positive("Selecciona un detalle."),
  cantidad: z.coerce.number({ error: "La cantidad es obligatoria." }).gt(0, "La cantidad debe ser mayor a 0."),
})

export const notaCreditoSchema = z.object({
  comprobante_id: z.coerce.number({ error: "Selecciona un comprobante." }).int().positive("Selecciona un comprobante."),
  motivo_codigo: z.string().trim().min(1, "Selecciona el motivo."),
  motivo_descripcion: optionalString,
  tipo_nota: z.enum(["TOTAL", "PARCIAL"], { error: "Selecciona el tipo de nota." }),
  afecta_stock: z.boolean().default(false),
  afecta_caja: z.boolean().default(false),
  observacion: optionalString,
  detalles: z.array(notaCreditoDetalleSchema).default([]),
}).superRefine((value, ctx) => {
  if (value.motivo_codigo === "08" && value.tipo_nota !== "PARCIAL") {
    ctx.addIssue({ code: "custom", path: ["tipo_nota"], message: "El motivo 08 requiere una nota parcial." })
  }

  if (value.tipo_nota === "PARCIAL" && value.detalles.length === 0) {
    ctx.addIssue({ code: "custom", path: ["detalles"], message: "Selecciona al menos un item para una nota parcial." })
  }
})

export type NotaCreditoFormValues = z.infer<typeof notaCreditoSchema>