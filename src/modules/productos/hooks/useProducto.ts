import { useQuery } from "@tanstack/react-query"

import { productoService } from "@/modules/productos/services/producto.service"

export function useProducto(id?: number) {
  return useQuery({
    queryKey: ["productos", id],
    queryFn: () => productoService.getProducto(id as number),
    enabled: Boolean(id),
  })
}
