import { z } from "zod"

export function sunatConfiguracionSchema(isEdit = false) {
  return z.object({
    ruc: z.string().trim().length(11, "El RUC debe tener 11 digitos.").regex(/^\d+$/, "El RUC solo debe contener numeros."),
    razon_social: z.string().trim().min(2, "La razon social es obligatoria."),
    nombre_comercial: z.string().trim().optional().nullable(),
    direccion_fiscal: z.string().trim().min(2, "La direccion fiscal es obligatoria."),
    ubigeo: z.string().trim().length(6, "El ubigeo debe tener 6 digitos.").regex(/^\d+$/, "El ubigeo solo debe contener numeros."),
    departamento: z.string().trim().min(2, "El departamento es obligatorio."),
    provincia: z.string().trim().min(2, "La provincia es obligatoria."),
    distrito: z.string().trim().min(2, "El distrito es obligatorio."),
    usuario_sol: z.string().trim().min(1, "El usuario SOL es obligatorio."),
    clave_sol: isEdit ? z.string().optional().nullable() : z.string().trim().min(1, "La clave SOL es obligatoria."),
    certificado: z.instanceof(File).optional().nullable(),
    certificado_password: z.string().optional().nullable(),
    ambiente: z.enum(["BETA", "PRODUCCION"], { message: "Seleccione un ambiente valido." }),
    modo_envio: z.enum(["MANUAL", "AUTOMATICO"], { message: "Seleccione un modo de envio valido." }),
    gre_modo_envio: z.boolean(),
    gre_client_id: z.string().trim().optional().nullable(),
    gre_client_secret: z.string().optional().nullable(),
    gre_usuario_sol: z.string().trim().optional().nullable(),
    gre_clave_sol: z.string().optional().nullable(),
    gre_scope: z.string().trim().optional().nullable(),
    estado: z.boolean(),
  }).superRefine((value, ctx) => {
    if (!value.gre_modo_envio) return

    if (!value.gre_client_id?.trim()) ctx.addIssue({ code: "custom", path: ["gre_client_id"], message: "El Client ID GRE es obligatorio." })
    if (!isEdit && !value.gre_client_secret?.trim()) ctx.addIssue({ code: "custom", path: ["gre_client_secret"], message: "El Client Secret GRE es obligatorio." })
    if (!value.gre_usuario_sol?.trim()) ctx.addIssue({ code: "custom", path: ["gre_usuario_sol"], message: "El usuario SOL GRE es obligatorio." })
    if (!isEdit && !value.gre_clave_sol?.trim()) ctx.addIssue({ code: "custom", path: ["gre_clave_sol"], message: "La clave SOL GRE es obligatoria." })
  })
}

export type SunatConfiguracionSchemaValues = z.infer<ReturnType<typeof sunatConfiguracionSchema>>