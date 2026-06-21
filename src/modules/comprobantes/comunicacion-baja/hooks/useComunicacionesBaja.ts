import { useQuery } from "@tanstack/react-query"

import { comunicacionBajaService } from "../services/comunicacionBaja.service"
import type { ComunicacionBajaFilters } from "../types/comunicacionBaja.types"

export const comunicacionesBajaQueryKey = (filters?: ComunicacionBajaFilters) => ["comunicaciones-baja", filters ?? {}] as const

export function useComunicacionesBaja(filters: ComunicacionBajaFilters) {
  return useQuery({
    queryKey: comunicacionesBajaQueryKey(filters),
    queryFn: () => comunicacionBajaService.getComunicaciones(filters),
  })
}
