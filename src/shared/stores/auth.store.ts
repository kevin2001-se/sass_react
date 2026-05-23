import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  AuthApiResponse,
  AuthSession,
  Empresa,
  Permission,
  Role,
  Tenant,
  Tienda,
  User,
} from "@/shared/types/auth.types"

type AuthState = AuthSession & {
  isAuthenticated: boolean
  isLoading: boolean
  isBootstrapped: boolean
  hydrateFromStorage: () => void
  setLoading: (loading: boolean) => void
  setSession: (session: Partial<AuthSession>) => void
  setSessionFromApi: (response: AuthApiResponse) => void
  clearSession: () => void
  setTiendaActiva: (tienda: Tienda | null) => void
  hasPermission: (permission?: string) => boolean
  hasAnyPermission: (permissions?: string[]) => boolean
}

const TOKEN_KEY = "token"
const SESSION_KEY = "auth_session"

const initialState: AuthSession = {
  user: null,
  tenant: null,
  empresa: null,
  tiendaActiva: null,
  tiendasDisponibles: [],
  roles: [],
  permisos: [],
  token: null,
}

function normalizeApiSession(response: AuthApiResponse): Partial<AuthSession> {
  return {
    token: response.token,
    user: response.user,
    tenant: response.tenant,
    empresa: response.empresa,
    tiendaActiva: response.tienda_activa,
    tiendasDisponibles: response.tiendas_disponibles ?? [],
    roles: response.roles ?? [],
    permisos: response.permisos ?? [],
  }
}

function persistSession(session: Partial<AuthSession>) {
  if (session.token) {
    localStorage.setItem(TOKEN_KEY, session.token)
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      user: session.user ?? null,
      tenant: session.tenant ?? null,
      empresa: session.empresa ?? null,
      tiendaActiva: session.tiendaActiva ?? null,
      tiendasDisponibles: session.tiendasDisponibles ?? [],
      roles: session.roles ?? [],
      permisos: session.permisos ?? [],
    }),
  )
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      isAuthenticated: false,
      isLoading: false,
      isBootstrapped: false,
      hydrateFromStorage: () => {
        const token = localStorage.getItem(TOKEN_KEY)
        const rawSession = localStorage.getItem(SESSION_KEY)
        const parsedSession = rawSession ? JSON.parse(rawSession) as Partial<AuthSession> : {}

        set({
          ...parsedSession,
          token,
          isAuthenticated: Boolean(token),
        })
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setSession: (session) =>
        set((state) => {
          const nextSession = {
            ...state,
            ...session,
            token: session.token ?? state.token,
          }

          persistSession(nextSession)

          return {
            ...nextSession,
            isAuthenticated: Boolean(nextSession.user && nextSession.token),
            isBootstrapped: true,
          }
        }),
      setSessionFromApi: (response) => get().setSession(normalizeApiSession(response)),
      clearSession: () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(SESSION_KEY)
        set({
          ...initialState,
          isAuthenticated: false,
          isLoading: false,
          isBootstrapped: true,
        })
      },
      setTiendaActiva: (tienda) =>
        set((state) => {
          const nextState = { ...state, tiendaActiva: tienda }
          persistSession(nextState)
          return { tiendaActiva: tienda }
        }),
      hasPermission: (permission) => !permission || get().permisos.includes(permission),
      hasAnyPermission: (permissions) =>
        !permissions || permissions.length === 0 || permissions.some((permission) => get().hasPermission(permission)),
    }),
    {
      name: "saas-botica-auth",
      partialize: (state) => ({
        user: state.user as User | null,
        tenant: state.tenant as Tenant | null,
        empresa: state.empresa as Empresa | null,
        tiendaActiva: state.tiendaActiva as Tienda | null,
        tiendasDisponibles: state.tiendasDisponibles,
        roles: state.roles as Role[],
        permisos: state.permisos as Permission[],
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
