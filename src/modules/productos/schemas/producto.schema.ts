import { z } from "zod"

const nullableNumber = z.preprocess(
  (value) => value === "" || value === undefined ? null : Number(value),
  z.number().nullable(),
)

const requiredNumber = z.preprocess(
  (value) => Number(value),
  z.number({ error: "Campo requerido" }).int().positive("Campo requerido"),
)

export const productoPresentacionSchema = z.object({
  id: z.number().optional(),
  unidad_medida_id: requiredNumber,
  nombre: z.string().min(1, "El nombre de la presentacion es obligatorio"),
  codigo_barra: z.string()
    .regex(/^[A-Za-z0-9_-]+$/, "Solo letras, numeros, guiones y guiones bajos")
    .nullable()
    .optional()
    .or(z.literal("")),
  factor_conversion: z.coerce.number().positive("El factor debe ser mayor a 0"),
  precio_compra: nullableNumber.optional(),
  precio_venta: z.coerce.number().min(0, "El precio de venta debe ser mayor o igual a 0"),
  es_principal: z.boolean(),
  estado: z.boolean(),
})

export const productoSchema = z.object({
  codigo_interno: z.string().nullable().optional(),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().nullable().optional(),
  concentracion: z.string().nullable().optional(),
  categoria_id: requiredNumber,
  marca_id: nullableNumber.optional(),
  laboratorio_id: nullableNumber.optional(),
  principio_activo_id: nullableNumber.optional(),
  principios_activos: z.array(z.number()).default([]),
  accion_terapeutica_id: nullableNumber.optional(),
  afectacion_igv_id: requiredNumber,
  requiere_receta: z.boolean(),
  maneja_lote: z.boolean(),
  maneja_vencimiento: z.boolean(),
  afecto_igv: z.boolean().optional(),
  estado: z.boolean(),
  presentaciones: z.array(productoPresentacionSchema).min(1, "Debe agregar al menos una presentacion"),
}).superRefine((value, ctx) => {
  if (value.maneja_lote && !value.maneja_vencimiento) {
    ctx.addIssue({
      code: "custom",
      path: ["maneja_vencimiento"],
      message: "Si maneja lote, tambien debe manejar vencimiento",
    })
  }

  const principales = value.presentaciones.filter((presentacion) => presentacion.es_principal)
  if (principales.length !== 1) {
    ctx.addIssue({
      code: "custom",
      path: ["presentaciones"],
      message: "Debe existir exactamente una presentacion principal",
    })
  }
})

export type ProductoFormValues = z.infer<typeof productoSchema>
