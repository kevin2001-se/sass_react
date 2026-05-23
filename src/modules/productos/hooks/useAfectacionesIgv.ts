import { useQuery } from "@tanstack/react-query"

import { afectacionIgvService } from "@/modules/productos/services/afectacionIgv.service"

export function useAfectacionesIgv() {
  return useQuery({
    queryKey: ["afectaciones-igv"],
    queryFn: () => afectacionIgvService.getAfectaciones(),
    staleTime: 1000 * 60 * 30,
  })
}
