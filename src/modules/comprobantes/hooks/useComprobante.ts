import { useQuery } from "@tanstack/react-query"
import { comprobanteService } from "@/modules/comprobantes/services/comprobante.service"

export function useComprobante(id?: number) {
  return useQuery({ queryKey: ["comprobante", id], queryFn: () => comprobanteService.getComprobante(Number(id)), enabled: Boolean(id) })
}