import { z } from "zod"

const detalleSchema = z.object({
  producto_id: z.coerce.number().int().positive("Seleccione producto"),
  producto_presentacion_id: z.coerce.number().int().positive("Seleccione presentacion"),
  lote_id: z.coerce.number().int().positive().nullable().optional(),
  codigo_lote: z.string().trim().optional().nullable(),
  fecha_vencimiento: z.string().optional().nullable(),
  cantidad_presentacion: z.coerce.number().gt(0, "La cantidad debe ser mayor a 0"),
  costo_unitario: z.coerce.number().min(0, "El costo no puede ser negativo"),
  descuento: z.coerce.number().min(0, "El descuento no puede ser negativo").default(0),
})

export const compraSchema = z.object({
  proveedor_id: z.coerce.number().int().positive("Seleccione proveedor"),
  tipo_documento: z.enum(["FACTURA", "BOLETA", "NOTA_COMPRA", "GUIA_PROVEEDOR"]),
  serie: z.string().trim().min(1, "Ingrese serie").max(20),
  correlativo: z.string().trim().min(1, "Ingrese correlativo").max(30),
  fecha_emision: z.string().min(1, "Ingrese fecha de emision"),
  fecha_vencimiento: z.string().optional().nullable(),
  tipo_pago: z.enum(["CONTADO", "CREDITO"]),
  moneda: z.enum(["PEN", "USD"]).default("PEN"),
  observacion: z.string().optional().nullable(),
  detalles: z.array(detalleSchema).min(1, "Agregue al menos un producto"),
})

export type CompraSchemaValues = z.infer<typeof compraSchema>
