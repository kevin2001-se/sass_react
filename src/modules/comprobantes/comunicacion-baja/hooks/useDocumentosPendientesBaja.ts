import { useQuery } from "@tanstack/react-query"

import { comunicacionBajaService } from "../services/comunicacionBaja.service"
import type { DocumentosPendientesBajaFilters } from "../types/comunicacionBaja.types"

export const documentosPendientesBajaQueryKey = (filters?: DocumentosPendientesBajaFilters) => ["comunicaciones-baja", "documentos-pendientes", filters ?? {}] as const

export function useDocumentosPendientesBaja(filters: DocumentosPendientesBajaFilters = {}, enabled = true) {
  return useQuery({
    queryKey: documentosPendientesBajaQueryKey(filters),
    queryFn: () => comunicacionBajaService.getDocumentosPendientes(filters),
    enabled,
  })
}
