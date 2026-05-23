import { useQuery } from "@tanstack/react-query"

import { productoCatalogosService } from "@/modules/productos/services/productoCatalogos.service"

export function useProductoCatalogos() {
  return useQuery({
    queryKey: ["productos", "catalogos"],
    queryFn: () => productoCatalogosService.getCatalogos(),
    staleTime: 1000 * 60 * 5,
  })
}
