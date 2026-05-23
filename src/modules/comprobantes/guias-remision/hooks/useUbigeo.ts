import { useQuery } from "@tanstack/react-query"

import { ubigeoService } from "@/modules/comprobantes/guias-remision/services/ubigeo.service"

export function useDepartamentos() {
  return useQuery({ queryKey: ["ubigeo", "departamentos"], queryFn: () => ubigeoService.getDepartamentos() })
}

export function useProvincias(departamentoId?: number | string | null) {
  return useQuery({
    queryKey: ["ubigeo", "provincias", departamentoId],
    queryFn: () => ubigeoService.getProvincias(departamentoId),
    enabled: Boolean(departamentoId),
  })
}

export function useDistritos(provinciaId?: number | string | null) {
  return useQuery({
    queryKey: ["ubigeo", "distritos", provinciaId],
    queryFn: () => ubigeoService.getDistritos(provinciaId),
    enabled: Boolean(provinciaId),
  })
}
