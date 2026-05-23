import { useQuery } from "@tanstack/react-query"

import { inventarioService } from "@/modules/inventario/services/inventario.service"
import type { MovimientoFilters } from "@/modules/inventario/types/inventario.types"

export function useKardex(productoId?: number, filters: MovimientoFilters = {}) {
  return useQuery({
    queryKey: ["inventario", "kardex", productoId, filters],
    queryFn: () => inventarioService.getKardex(productoId as number, filters),
    enabled: Boolean(productoId),
  })
}
