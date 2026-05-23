import { z } from "zod"

export const posClienteSchema = z.object({
  tipo_documento: z.enum(["DNI", "RUC", "CE", "SIN_DOCUMENTO"]),
  numero_documento: z.string().nullable().optional(),
  nombres: z.string().nullable().optional(),
  razon_social: z.string().nullable().optional(),
  direccion: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  email: z.string().email("Email invalido.").or(z.literal("")).nullable().optional(),
  estado: z.boolean().default(true),
}).superRefine((values, ctx) => {
  const numero = values.numero_documento ?? ""

  if (values.tipo_documento === "RUC") {
    if (!/^\d{11}$/.test(numero)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["numero_documento"], message: "El RUC debe tener 11 digitos." })
    }
    if (!values.razon_social || values.razon_social.trim().length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["razon_social"], message: "La razon social es obligatoria." })
    }
  }

  if (values.tipo_documento === "DNI") {
    if (!/^\d{8}$/.test(numero)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["numero_documento"], message: "El DNI debe tener 8 digitos." })
    }
    if (!values.nombres || values.nombres.trim().length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nombres"], message: "Los nombres son obligatorios." })
    }
  }

  if (values.tipo_documento === "CE") {
    if (numero.length < 6) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["numero_documento"], message: "El CE debe tener al menos 6 caracteres." })
    }
    if (!values.nombres || values.nombres.trim().length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nombres"], message: "Los nombres son obligatorios." })
    }
  }

  if (values.tipo_documento === "SIN_DOCUMENTO" && (!values.nombres || values.nombres.trim().length < 2)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nombres"], message: "Los nombres son obligatorios." })
  }
})

export type PosClienteFormValues = z.infer<typeof posClienteSchema>
