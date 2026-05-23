import { useQuery } from "@tanstack/react-query"

import { catalogosService } from "@/modules/catalogos/services/catalogos.service"
import type { CatalogoConfig, CatalogoFilters } from "@/modules/catalogos/types/catalogo.types"

export function useCatalogos(config: CatalogoConfig, filters: CatalogoFilters) {
  return useQuery({
    queryKey: ["catalogos", config.kind, filters],
    queryFn: () => catalogosService.list(config, filters),
  })
}
