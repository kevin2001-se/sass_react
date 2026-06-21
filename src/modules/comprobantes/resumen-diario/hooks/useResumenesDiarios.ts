import { useQuery } from "@tanstack/react-query"

import { resumenDiarioService } from "../services/resumenDiario.service"
import type { ResumenDiarioFilters } from "../types/resumenDiario.types"

export const resumenesDiariosQueryKey = (filters?: ResumenDiarioFilters) => ["resumenes-diarios", filters ?? {}] as const

export function useResumenesDiarios(filters: ResumenDiarioFilters) {
  return useQuery({
    queryKey: resumenesDiariosQueryKey(filters),
    queryFn: () => resumenDiarioService.getResumenes(filters),
  })
}