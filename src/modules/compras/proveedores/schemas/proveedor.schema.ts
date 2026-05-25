import { z } from "zod"

export const proveedorSchema = z.object({
  tipo_documento: z.enum(["RUC", "DNI", "CE", "SIN_DOCUMENTO"]),
  numero_documento: z.string().min(1, "El número de documento es obligatorio"),
  razon_social: z.string().min(2, "La razón social debe tener al menos 2 caracteres"),
  nombre_comercial: z.string().optional(),
  direccion: z.string().optional(),
  ubigeo: z.string().optional().refine((value) => !value || value.length === 6, "El ubigeo debe tener 6 dígitos"),
  telefono: z.string().optional(),
  email: z.string().optional().refine((value) => !value || z.string().email().safeParse(value).success, "Email inválido"),
  contacto: z.string().optional(),
  estado: z.boolean(),
}).superRefine((values, ctx) => {
  if (values.tipo_documento === "RUC" && values.numero_documento.length !== 11) {
    ctx.addIssue({ code: "custom", path: ["numero_documento"], message: "El RUC debe tener 11 dígitos" })
  }
  if (values.tipo_documento === "DNI" && values.numero_documento.length !== 8) {
    ctx.addIssue({ code: "custom", path: ["numero_documento"], message: "El DNI debe tener 8 dígitos" })
  }
})

export type ProveedorSchemaValues = z.infer<typeof proveedorSchema>