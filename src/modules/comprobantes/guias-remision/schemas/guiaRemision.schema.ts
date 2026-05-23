import { z } from "zod"

const numberFromInput = (message: string) => z.coerce.number({ error: message })
const optionalNumberFromInput = z.preprocess((value) => value === "" || value === null || value === undefined ? null : value, z.coerce.number().nullable())

export const guiaRemisionDetalleSchema = z.object({
  producto_id: optionalNumberFromInput,
  descripcion: z.string().trim().min(1, "La descripcion es obligatoria."),
  unidad_medida: z.string().trim().min(1, "La unidad es obligatoria."),
  cantidad: numberFromInput("La cantidad es obligatoria.").gt(0, "La cantidad debe ser mayor a 0."),
  peso: optionalNumberFromInput.refine((value) => value === null || value >= 0, "El peso no puede ser negativo."),
})

const ubicacionManualSchema = {
  punto_partida_departamento_id: optionalNumberFromInput,
  punto_partida_provincia_id: optionalNumberFromInput,
  punto_partida_distrito_id: optionalNumberFromInput,
  punto_partida_ubigeo: z.string().trim().length(6, "El ubigeo de partida debe tener 6 digitos."),
  punto_partida_direccion: z.string().trim().min(1, "La direccion de partida es obligatoria."),
  punto_llegada_departamento_id: optionalNumberFromInput,
  punto_llegada_provincia_id: optionalNumberFromInput,
  punto_llegada_distrito_id: optionalNumberFromInput,
  punto_llegada_ubigeo: z.string().trim().length(6, "El ubigeo de llegada debe tener 6 digitos."),
  punto_llegada_direccion: z.string().trim().min(1, "La direccion de llegada es obligatoria."),
}

const ubicacionLlegadaSchema = {
  punto_llegada_departamento_id: optionalNumberFromInput,
  punto_llegada_provincia_id: optionalNumberFromInput,
  punto_llegada_distrito_id: optionalNumberFromInput,
  punto_llegada_ubigeo: z.string().trim().length(6, "El ubigeo de llegada debe tener 6 digitos."),
  punto_llegada_direccion: z.string().trim().min(1, "La direccion de llegada es obligatoria."),
}

export const guiaRemisionSchema = z.object({
  fecha_emision: z.string().min(1, "La fecha de emision es obligatoria."),
  fecha_traslado: z.string().min(1, "La fecha de traslado es obligatoria."),
  motivo_traslado_codigo: z.string().min(1, "El motivo es obligatorio."),
  motivo_traslado_descripcion: z.string().trim().optional().nullable(),
  modalidad_transporte: z.string().min(1, "La modalidad es obligatoria."),
  peso_total: numberFromInput("El peso total es obligatorio.").gt(0, "El peso total debe ser mayor a 0."),
  unidad_peso: z.string().trim().min(1, "La unidad de peso es obligatoria."),
  numero_bultos: optionalNumberFromInput,
  observacion: z.string().trim().optional().nullable(),
  destinatario_tipo_documento: z.string().trim().min(1, "El tipo de documento es obligatorio."),
  destinatario_numero_documento: z.string().trim().min(1, "El numero de documento es obligatorio."),
  destinatario_nombre: z.string().trim().min(1, "El destinatario es obligatorio."),
  ...ubicacionManualSchema,
  conductor_tipo_documento: z.string().trim().optional().nullable(),
  conductor_numero_documento: z.string().trim().optional().nullable(),
  conductor_nombre: z.string().trim().optional().nullable(),
  conductor_licencia: z.string().trim().optional().nullable(),
  vehiculo_placa: z.string().trim().optional().nullable(),
  transportista_ruc: z.string().trim().optional().nullable(),
  transportista_razon_social: z.string().trim().optional().nullable(),
  detalles: z.array(guiaRemisionDetalleSchema).min(1, "Agrega al menos un detalle."),
}).superRefine((value, ctx) => {
  if (value.fecha_emision && value.fecha_traslado && value.fecha_traslado < value.fecha_emision) {
    ctx.addIssue({ code: "custom", path: ["fecha_traslado"], message: "La fecha de traslado debe ser mayor o igual a la fecha de emision." })
  }
  if (value.punto_partida_ubigeo === value.punto_llegada_ubigeo && value.punto_partida_direccion.trim().toUpperCase() === value.punto_llegada_direccion.trim().toUpperCase()) {
    ctx.addIssue({ code: "custom", path: ["punto_llegada_direccion"], message: "El punto de partida y llegada no pueden ser exactamente iguales." })
  }
  validateTraslado(value, ctx)
})

export type GuiaRemisionFormValues = z.infer<typeof guiaRemisionSchema>

export const guiaDesdeVentaSchema = z.object({
  fecha_traslado: z.string().min(1, "La fecha de traslado es obligatoria."),
  motivo_traslado_codigo: z.string().min(1, "El motivo es obligatorio."),
  motivo_traslado_descripcion: z.string().trim().optional().nullable(),
  modalidad_transporte: z.string().min(1, "La modalidad es obligatoria."),
  ...ubicacionLlegadaSchema,
  peso_total: numberFromInput("El peso total es obligatorio.").gt(0, "El peso total debe ser mayor a 0."),
  unidad_peso: z.string().trim().min(1, "La unidad de peso es obligatoria."),
  numero_bultos: optionalNumberFromInput,
  observacion: z.string().trim().optional().nullable(),
  conductor_tipo_documento: z.string().trim().optional().nullable(),
  conductor_numero_documento: z.string().trim().optional().nullable(),
  conductor_nombre: z.string().trim().optional().nullable(),
  conductor_licencia: z.string().trim().optional().nullable(),
  vehiculo_placa: z.string().trim().optional().nullable(),
  transportista_ruc: z.string().trim().optional().nullable(),
  transportista_razon_social: z.string().trim().optional().nullable(),
}).superRefine((value, ctx) => {
  const today = new Date().toISOString().slice(0, 10)
  if (value.fecha_traslado && value.fecha_traslado < today) {
    ctx.addIssue({ code: "custom", path: ["fecha_traslado"], message: "La fecha de traslado debe ser mayor o igual a hoy." })
  }
  validateTraslado(value, ctx)
})

export type GuiaDesdeVentaFormValues = z.infer<typeof guiaDesdeVentaSchema>

function validateTraslado(value: { motivo_traslado_codigo?: string; motivo_traslado_descripcion?: string | null; modalidad_transporte?: string; transportista_ruc?: string | null; transportista_razon_social?: string | null; conductor_tipo_documento?: string | null; conductor_numero_documento?: string | null; conductor_nombre?: string | null; conductor_licencia?: string | null; vehiculo_placa?: string | null }, ctx: z.RefinementCtx) {
  if (value.motivo_traslado_codigo === "13" && !value.motivo_traslado_descripcion?.trim()) {
    ctx.addIssue({ code: "custom", path: ["motivo_traslado_descripcion"], message: "La descripcion del motivo es obligatoria para Otros." })
  }
  if (value.modalidad_transporte === "01") {
    if (!value.transportista_ruc?.trim()) ctx.addIssue({ code: "custom", path: ["transportista_ruc"], message: "El RUC del transportista es obligatorio." })
    if (value.transportista_ruc?.trim() && !/^\d{11}$/.test(value.transportista_ruc.trim())) ctx.addIssue({ code: "custom", path: ["transportista_ruc"], message: "El RUC debe tener 11 digitos." })
    if (!value.transportista_razon_social?.trim()) ctx.addIssue({ code: "custom", path: ["transportista_razon_social"], message: "La razon social del transportista es obligatoria." })
  }
  if (value.modalidad_transporte === "02") {
    if (!value.conductor_tipo_documento?.trim()) ctx.addIssue({ code: "custom", path: ["conductor_tipo_documento"], message: "El tipo de documento del conductor es obligatorio." })
    if (!value.conductor_numero_documento?.trim()) ctx.addIssue({ code: "custom", path: ["conductor_numero_documento"], message: "El documento del conductor es obligatorio." })
    if (!value.conductor_nombre?.trim()) ctx.addIssue({ code: "custom", path: ["conductor_nombre"], message: "El nombre del conductor es obligatorio." })
    if (!value.conductor_licencia?.trim()) ctx.addIssue({ code: "custom", path: ["conductor_licencia"], message: "La licencia es obligatoria." })
    const licencia = value.conductor_licencia?.trim().toUpperCase() ?? ""
    const licenciaNormalizada = licencia.replace(/[^A-Z0-9]/g, "")
    if (licencia && licenciaNormalizada.length < 5) ctx.addIssue({ code: "custom", path: ["conductor_licencia"], message: "La licencia debe tener al menos 5 caracteres alfanumericos. Ejemplo: Q12345678." })
    if (licencia && /[^A-Z0-9-]/.test(licencia)) ctx.addIssue({ code: "custom", path: ["conductor_licencia"], message: "La licencia solo debe contener letras, numeros o guion." })
    if (!value.vehiculo_placa?.trim()) ctx.addIssue({ code: "custom", path: ["vehiculo_placa"], message: "La placa es obligatoria." })
  }
}

