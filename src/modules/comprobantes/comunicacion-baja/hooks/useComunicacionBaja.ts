import { useQuery } from "@tanstack/react-query"

import { comunicacionBajaService } from "../services/comunicacionBaja.service"

export const comunicacionBajaQueryKey = (id?: number | string) => ["comunicaciones-baja", id] as const

export function useComunicacionBaja(id?: number | string) {
  return useQuery({
    queryKey: comunicacionBajaQueryKey(id),
    queryFn: () => comunicacionBajaService.getComunicacion(id as number | string),
    enabled: Boolean(id),
  })
}
