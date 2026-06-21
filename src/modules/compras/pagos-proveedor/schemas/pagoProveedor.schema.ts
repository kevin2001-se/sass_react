import { z } from "zod"

export const pagoProveedorSchema = z.object({
  cuenta_por_pagar_id: z.coerce.number({ message: "Seleccione una cuenta por pagar" }).int().positive("Seleccione una cuenta por pagar"),
  metodo_pago: z.enum(["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"]),
  monto: z.coerce.number().positive("El monto debe ser mayor a cero"),
  fecha_pago: z.string().min(1, "La fecha de pago es obligatoria"),
  referencia: z.string().max(255).optional().nullable(),
  observacion: z.string().max(500).optional().nullable(),
})

export const anularPagoProveedorSchema = z.object({
  motivo: z.string().min(3, "Ingrese un motivo").max(500),
})