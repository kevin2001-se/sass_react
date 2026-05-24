import { useQuery } from "@tanstack/react-query"
import { notaCreditoService } from "@/modules/comprobantes/notas-credito/services/notaCredito.service"
import type { NotaCreditoFilters } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"

export function useNotasCredito(filters: NotaCreditoFilters) {
  return useQuery({ queryKey: ["notas-credito", filters], queryFn: () => notaCreditoService.getNotasCredito(filters) })
}