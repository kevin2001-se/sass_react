export type Permission = { id: number; name: string; label: string; description?: string | null; active: boolean; modulo: string }
export type Role = { id: number; name: string; slug: string; description?: string | null; active: boolean; permissions?: Permission[]; permission_ids?: number[] }
export type RoleFormValues = { name: string; description?: string; active: boolean; permissions: number[] }
export type RoleFilters = { q?: string; active?: string; page?: number; per_page?: number }