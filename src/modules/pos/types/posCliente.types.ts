export type PosTipoDocumentoCliente = "DNI" | "RUC" | "CE" | "SIN_DOCUMENTO"

export type PosCliente = {
  id: number | null
  tipo_documento: PosTipoDocumentoCliente
  numero_documento?: string | null
  nombres?: string | null
  razon_social?: string | null
  direccion?: string | null
  telefono?: string | null
  email?: string | null
  estado?: boolean
  display_name?: string | null
  es_cliente_varios?: boolean
}

export type PosClientePayload = {
  tipo_documento: PosTipoDocumentoCliente
  numero_documento?: string | null
  nombres: string
  razon_social?: string | null
  direccion?: string | null
  telefono?: string | null
  email?: string | null
  estado?: boolean
}

export type PosClienteSearchResponse = {
  data: PosCliente[]
}

export const CLIENTE_VARIOS: PosCliente = {
  id: null,
  tipo_documento: "SIN_DOCUMENTO",
  numero_documento: null,
  nombres: "CLIENTES VARIOS",
  razon_social: null,
  direccion: null,
  telefono: null,
  email: null,
  display_name: "CLIENTES VARIOS",
  es_cliente_varios: true,
}

export function getPosClienteName(cliente?: PosCliente | null) {
  if (!cliente) return "Sin cliente"
  return cliente.razon_social || cliente.nombres || cliente.display_name || "Cliente sin nombre"
}
