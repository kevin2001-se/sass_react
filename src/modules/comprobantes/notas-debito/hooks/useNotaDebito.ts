import { useQuery } from "@tanstack/react-query"
import { notaDebitoService } from "@/modules/comprobantes/notas-debito/services/notaDebito.service"

export function useNotaDebito(id?: string | number) {
  return useQuery({ queryKey: ["notas-debito", id], queryFn: () => notaDebitoService.getNotaDebito(id as number | string), enabled: Boolean(id) })
}