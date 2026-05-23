import { useQuery } from "@tanstack/react-query"

import { productoService } from "@/modules/productos/services/producto.service"
import type { ProductoFilters } from "@/modules/productos/types/producto.types"

export function useProductos(filters: ProductoFilters) {
  return useQuery({
    queryKey: ["productos", filters],
    queryFn: () => productoService.getProductos(filters),
  })
}
