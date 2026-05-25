export type EmpresaConfiguracion = {
  id: number
  ruc: string
  razon_social: string
  nombre_comercial?: string | null
  direccion_fiscal: string
  ubigeo?: string | null
  telefono?: string | null
  email?: string | null
  logo_url?: string | null
  estado: boolean
}

export type EmpresaFormValues = {
  ruc: string
  razon_social: string
  nombre_comercial?: string
  direccion_fiscal: string
  ubigeo?: string
  telefono?: string
  email?: string
  logo?: FileList | null
  estado: boolean
}