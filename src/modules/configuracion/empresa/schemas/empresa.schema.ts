import { z } from "zod"

export const empresaSchema = z.object({
  ruc: z.string().length(11, "El RUC debe tener 11 dígitos"),
  razon_social: z.string().min(1, "La razón social es obligatoria"),
  nombre_comercial: z.string().optional(),
  direccion_fiscal: z.string().min(1, "La dirección fiscal es obligatoria"),
  ubigeo: z.string().optional().refine((v) => !v || v.length === 6, "El ubigeo debe tener 6 dígitos"),
  telefono: z.string().optional(),
  email: z.string().optional().refine((v) => !v || z.string().email().safeParse(v).success, "Email inválido"),
  logo: z.any().optional(),
  estado: z.boolean(),
})
export type EmpresaSchemaValues = z.infer<typeof empresaSchema>