import { useQuery } from "@tanstack/react-query"
import { comprobanteService } from "@/modules/comprobantes/services/comprobante.service"
import type { ComprobanteFilters } from "@/modules/comprobantes/types/comprobante.types"

export function useComprobantes(filters: ComprobanteFilters) {
  return useQuery({ queryKey: ["comprobantes", filters], queryFn: () => comprobanteService.getComprobantes(filters) })
}