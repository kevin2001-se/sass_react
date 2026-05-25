export type TipoDocumentoProveedor = "RUC" | "DNI" | "CE" | "SIN_DOCUMENTO"

export type Proveedor = {
  id: number
  tenant_id?: number
  empresa_id?: number
  tipo_documento: TipoDocumentoProveedor
  numero_documento: string
  razon_social: string
  nombre_comercial?: string | null
  direccion?: string | null
  ubigeo?: string | null
  telefono?: string | null
  email?: string | null
  contacto?: string | null
  estado: boolean
}

export type ProveedorFilters = {
  search?: string
  estado?: string
  tipo_documento?: string
  page?: number
  per_page?: number
}

export type ProveedorFormValues = {
  tipo_documento: TipoDocumentoProveedor
  numero_documento: string
  razon_social: string
  nombre_comercial?: string
  direccion?: string
  ubigeo?: string
  telefono?: string
  email?: string
  contacto?: string
  estado: boolean
}

export type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number }
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta }

export const tipoDocumentoProveedorOptions: { value: TipoDocumentoProveedor; label: string }[] = [
  { value: "RUC", label: "RUC" },
  { value: "DNI", label: "DNI" },
  { value: "CE", label: "Carnet extranjería" },
  { value: "SIN_DOCUMENTO", label: "Sin documento" },
]