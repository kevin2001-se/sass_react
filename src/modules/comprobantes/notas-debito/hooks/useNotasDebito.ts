import { useQuery } from "@tanstack/react-query"
import { notaDebitoService } from "@/modules/comprobantes/notas-debito/services/notaDebito.service"
import type { NotaDebitoFilters } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"

export function useNotasDebito(filters: NotaDebitoFilters) {
  return useQuery({ queryKey: ["notas-debito", filters], queryFn: () => notaDebitoService.getNotasDebito(filters) })
}