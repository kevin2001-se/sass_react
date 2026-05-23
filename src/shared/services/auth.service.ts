import { api } from "@/shared/services/api"
import type {
  AuthApiResponse,
  LaravelResourceResponse,
  LoginPayload,
  Permission,
  Role,
  Tienda,
} from "@/shared/types/auth.types"

type UserContextResource = {
  id: number
  name: string
  email: string
  tenant_id?: number | null
  empresa_id?: number | null
  tienda_activa_id?: number | null
  role?: unknown
  roles?: Role[] | Array<{ name?: string; slug?: string }>
  permisos?: Permission[]
  tenant?: AuthApiResponse["tenant"]
  empresa?: AuthApiResponse["empresa"]
  tienda_activa?: Tienda | null
  tiendas_disponibles?: Tienda[] | { data?: Tienda[] }
}

type AuthResponsePayload =
  | AuthApiResponse
  | LaravelResourceResponse<UserContextResource>
  | UserContextResource

function normalizeCollection<T>(value: T[] | { data?: T[] } | undefined): T[] {
  if (Array.isArray(value)) {
    return value
  }

  return value?.data ?? []
}

function normalizeRoles(value: UserContextResource["roles"]): Role[] {
  if (!value) {
    return []
  }

  return value.map((role) => {
    if (typeof role === "string") {
      return role
    }

    return role.name ?? role.slug ?? ""
  }).filter(Boolean)
}

export function normalizeAuthResponse(payload: AuthResponsePayload): AuthApiResponse {
  if ("user" in payload && !("data" in payload)) {
    return {
      token: payload.token,
      user: payload.user,
      tenant: payload.tenant,
      empresa: payload.empresa,
      tienda_activa: payload.tienda_activa,
      tiendas_disponibles: payload.tiendas_disponibles ?? [],
      roles: payload.roles ?? [],
      permisos: payload.permisos ?? [],
    }
  }

  const resource = ("data" in payload ? payload.data : payload) as UserContextResource

  return {
    token: "token" in payload ? payload.token : undefined,
    user: {
      id: resource.id,
      name: resource.name,
      email: resource.email,
      tenant_id: resource.tenant_id,
      empresa_id: resource.empresa_id,
      tienda_activa_id: resource.tienda_activa?.id ?? resource.tienda_activa_id ?? null,
    },
    tenant: resource.tenant ?? null,
    empresa: resource.empresa ?? null,
    tienda_activa: resource.tienda_activa ?? null,
    tiendas_disponibles: normalizeCollection(resource.tiendas_disponibles),
    roles: normalizeRoles(resource.roles),
    permisos: resource.permisos ?? [],
  }
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponsePayload>("/login", payload)
    return normalizeAuthResponse(data)
  },

  async logout() {
    await api.post("/logout")
  },

  async me() {
    const { data } = await api.get<AuthResponsePayload>("/me")
    return normalizeAuthResponse(data)
  },
}
