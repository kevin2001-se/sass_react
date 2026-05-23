export type User = {
  id: number
  name: string
  email: string
  tenant_id?: number | null
  empresa_id?: number | null
  tienda_activa_id?: number | null
}

export type Role = string
export type Permission = string

export type Tenant = {
  id: number
  nombre?: string
  name?: string
  slug?: string
}

export type Empresa = {
  id: number
  tenant_id?: number | null
  nombre?: string
  razon_social?: string
  nombre_comercial?: string | null
  ruc?: string
}

export type Tienda = {
  id: number
  tenant_id?: number | null
  empresa_id?: number | null
  nombre: string
  direccion?: string
  ubigeo?: string | null
  estado?: boolean
}

export type AuthSession = {
  user: User | null
  tenant: Tenant | null
  empresa: Empresa | null
  tiendaActiva: Tienda | null
  tiendasDisponibles: Tienda[]
  roles: Role[]
  permisos: Permission[]
  token: string | null
}

export type AuthApiResponse = {
  token?: string
  user: User | null
  tenant: Tenant | null
  empresa: Empresa | null
  tienda_activa: Tienda | null
  tiendas_disponibles: Tienda[]
  roles: Role[]
  permisos: Permission[]
}

export type LoginPayload = {
  email: string
  password: string
}

export type SeleccionarTiendaPayload = {
  tienda_id: number
}

export type SeleccionarTiendaResponse = AuthApiResponse | {
  message?: string
  tienda_activa: Tienda
}

export type LaravelResourceResponse<T> = {
  data: T
  token?: string
}



