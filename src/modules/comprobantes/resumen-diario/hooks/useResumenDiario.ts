import { useQuery } from "@tanstack/react-query"

import { resumenDiarioService } from "../services/resumenDiario.service"

export const resumenDiarioQueryKey = (id?: number | string) => ["resumenes-diarios", id] as const

export function useResumenDiario(id?: number | string) {
  return useQuery({
    queryKey: resumenDiarioQueryKey(id),
    queryFn: () => resumenDiarioService.getResumen(id as number | string),
    enabled: Boolean(id),
  })
}