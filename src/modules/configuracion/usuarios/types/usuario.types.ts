import type { Role } from "@/modules/configuracion/roles/types/role.types"
import type { Tienda } from "@/modules/configuracion/tiendas/types/tienda.types"
export type Usuario = { id: number; name: string; email: string; estado: boolean; role?: Role | null; roles?: Role[]; tiendas?: Tienda[]; tienda_activa?: Tienda | null }
export type UsuarioFormValues = { name: string; email: string; password?: string; estado: boolean; roles: number[]; tiendas: number[]; tienda_activa_id?: number | null }
export type UsuarioFilters = { q?: string; estado?: string; role_id?: number; page?: number; per_page?: number }