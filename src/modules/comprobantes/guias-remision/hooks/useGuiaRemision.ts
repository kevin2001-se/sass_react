import { useQuery } from "@tanstack/react-query"

import { guiaRemisionService } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"

export function useGuiaRemision(id?: number | string) {
  return useQuery({
    queryKey: ["guias-remision", id],
    queryFn: () => guiaRemisionService.getGuiaRemision(id as number | string),
    enabled: Boolean(id),
  })
}
