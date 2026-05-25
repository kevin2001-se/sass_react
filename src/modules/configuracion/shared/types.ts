export type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number }
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta }
export type ListFilters = { q?: string; estado?: string; page?: number; per_page?: number }
export function normalizePaginated<T>(response: any): PaginatedResponse<T> {
  if (response?.meta) return response as PaginatedResponse<T>
  return { data: response?.data ?? [], meta: { current_page: response?.current_page ?? 1, last_page: response?.last_page ?? 1, per_page: response?.per_page ?? 15, total: response?.total ?? response?.data?.length ?? 0 } }
}