import { useQuery } from "@tanstack/react-query"

import { cajaService } from "@/modules/caja/services/caja.service"
import type { CajaFilters } from "@/modules/caja/types/caja.types"

export function useCajaHistorial(filters: CajaFilters = {}) {
  return useQuery({
    queryKey: ["caja", "historial", filters],
    queryFn: () => cajaService.getCajas(filters),
  })
}
