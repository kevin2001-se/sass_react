import { useQuery } from "@tanstack/react-query"

import { guiaRemisionService } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"
import type { GuiaRemisionFilters } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"

export function useGuiasRemision(filters: GuiaRemisionFilters) {
  return useQuery({
    queryKey: ["guias-remision", filters],
    queryFn: () => guiaRemisionService.getGuiasRemision(filters),
  })
}
