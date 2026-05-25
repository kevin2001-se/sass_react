import { useQuery } from "@tanstack/react-query"
import { compraService } from "@/modules/compras/compras/services/compra.service"

export function useCompra(id?: number) {
  return useQuery({ queryKey: ["compras", id], queryFn: () => compraService.get(Number(id)), enabled: Boolean(id) })
}
