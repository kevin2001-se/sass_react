import { useQuery } from "@tanstack/react-query"

import { loteService } from "@/modules/inventario/services/lote.service"
import type { LoteFilters } from "@/modules/inventario/types/inventario.types"

export function useLotes(filters: LoteFilters = {}) {
  return useQuery({
    queryKey: ["inventario", "lotes", filters],
    queryFn: () => loteService.getLotes(filters),
  })
}

export function useLote(id?: number) {
  return useQuery({
    queryKey: ["inventario", "lotes", id],
    queryFn: () => loteService.getLote(id as number),
    enabled: Boolean(id),
  })
}
