import { useQuery } from "@tanstack/react-query"
import { notaDebitoService } from "@/modules/comprobantes/notas-debito/services/notaDebito.service"

export function useMotivosNotaDebito() {
  return useQuery({ queryKey: ["motivos-nota-debito"], queryFn: () => notaDebitoService.getMotivosNotaDebito() })
}