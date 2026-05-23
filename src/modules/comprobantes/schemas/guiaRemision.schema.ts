import { z } from "zod"

export const guiaRemisionSchema = z.object({
  fecha_traslado: z.string().min(1, "Selecciona la fecha de traslado"),
  motivo_traslado_codigo: z.string().min(1, "Selecciona el motivo"),
  motivo_traslado_descripcion: z.string().min(2, "Ingresa descripcion"),
  modalidad_transporte: z.enum(["01", "02"]),
  peso_total: z.coerce.number().gt(0, "El peso debe ser mayor a cero"),
  unidad_peso: z.string().min(1, "Ingresa unidad"),
  numero_bultos: z.coerce.number().optional(),
  punto_partida_ubigeo: z.string().min(6, "Ubigeo requerido"),
  punto_partida_direccion: z.string().min(3, "Direccion requerida"),
  punto_llegada_ubigeo: z.string().min(6, "Ubigeo requerido"),
  punto_llegada_direccion: z.string().min(3, "Direccion requerida"),
  transportista_tipo_documento: z.string().optional(),
  transportista_numero_documento: z.string().optional(),
  transportista_razon_social: z.string().optional(),
  conductor_tipo_documento: z.string().optional(),
  conductor_numero_documento: z.string().optional(),
  conductor_nombre: z.string().optional(),
  conductor_licencia: z.string().optional(),
  vehiculo_placa: z.string().optional(),
  observacion: z.string().optional(),
})

export type GuiaRemisionFormValues = z.infer<typeof guiaRemisionSchema>