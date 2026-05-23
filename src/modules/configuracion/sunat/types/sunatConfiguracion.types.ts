export type SunatAmbiente = "BETA" | "PRODUCCION"
export type SunatModoEnvio = "MANUAL" | "AUTOMATICO"

export type SunatConfiguracion = {
  id: number
  empresa_id: number
  ruc: string
  razon_social: string
  nombre_comercial?: string | null
  direccion_fiscal: string
  ubigeo: string
  departamento: string
  provincia: string
  distrito: string
  usuario_sol: string
  ambiente: SunatAmbiente
  modo_envio: SunatModoEnvio
  estado: boolean
  tiene_certificado: boolean
  gre_modo_envio?: boolean
  gre_habilitado?: boolean
  tiene_gre_credenciales?: boolean
  gre_client_id?: string | null
  gre_usuario_sol?: string | null
  gre_scope?: string | null
  gre_token_url?: string | null
  gre_api_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type SunatConfiguracionFormValues = {
  ruc: string
  razon_social: string
  nombre_comercial?: string | null
  direccion_fiscal: string
  ubigeo: string
  departamento: string
  provincia: string
  distrito: string
  usuario_sol: string
  clave_sol?: string | null
  certificado?: File | null
  certificado_password?: string | null
  ambiente: SunatAmbiente
  modo_envio: SunatModoEnvio
  gre_modo_envio: boolean
  gre_client_id?: string | null
  gre_client_secret?: string | null
  gre_usuario_sol?: string | null
  gre_clave_sol?: string | null
  gre_scope?: string | null
  estado: boolean
}