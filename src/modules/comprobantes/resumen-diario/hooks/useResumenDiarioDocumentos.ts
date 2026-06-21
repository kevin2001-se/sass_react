import { useQuery } from "@tanstack/react-query"

import { resumenDiarioService } from "../services/resumenDiario.service"

export const resumenDiarioDocumentosQueryKey = (fechaResumen?: string) => ["resumenes-diarios", "documentos-disponibles", fechaResumen] as const

export function useResumenDiarioDocumentos(fechaResumen?: string) {
  return useQuery({
    queryKey: resumenDiarioDocumentosQueryKey(fechaResumen),
    queryFn: () => resumenDiarioService.getDocumentosDisponibles(fechaResumen as string),
    enabled: Boolean(fechaResumen),
  })
}