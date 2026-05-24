import { useQuery } from "@tanstack/react-query"
import { notaCreditoService } from "@/modules/comprobantes/notas-credito/services/notaCredito.service"

export function useMotivosNotaCredito() {
  return useQuery({ queryKey: ["motivos-nota-credito"], queryFn: () => notaCreditoService.getMotivosNotaCredito(), staleTime: 1000 * 60 * 10 })
}