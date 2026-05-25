import { useQuery } from "@tanstack/react-query"
import { compraService } from "@/modules/compras/compras/services/compra.service"
import type { CompraFilters } from "@/modules/compras/compras/types/compra.types"

export function useCompras(filters: CompraFilters) {
  return useQuery({ queryKey: ["compras", "historial", filters], queryFn: () => compraService.list(filters) })
}
