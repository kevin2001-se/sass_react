import { useQuery } from "@tanstack/react-query"

import { inventarioService } from "@/modules/inventario/services/inventario.service"
import type { StockFilters } from "@/modules/inventario/types/inventario.types"

export function useStock(filters: StockFilters = {}) {
  return useQuery({
    queryKey: ["inventario", "stocks", filters],
    queryFn: () => inventarioService.getStocks(filters),
  })
}

export function useStockProducto(productoId?: number) {
  return useQuery({
    queryKey: ["inventario", "stocks", "producto", productoId],
    queryFn: () => inventarioService.getStockProducto(productoId as number),
    enabled: Boolean(productoId),
  })
}
