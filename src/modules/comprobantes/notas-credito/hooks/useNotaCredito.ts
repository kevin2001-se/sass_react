import { useQuery } from "@tanstack/react-query"
import { notaCreditoService } from "@/modules/comprobantes/notas-credito/services/notaCredito.service"

export function useNotaCredito(id?: number | string) {
  return useQuery({ queryKey: ["notas-credito", id], queryFn: () => notaCreditoService.getNotaCredito(id as number | string), enabled: Boolean(id) })
}