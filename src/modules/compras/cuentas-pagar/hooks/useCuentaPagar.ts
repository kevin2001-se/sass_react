import { useQuery } from "@tanstack/react-query"
import { cuentaPagarService } from "@/modules/compras/cuentas-pagar/services/cuentaPagar.service"

export function useCuentaPagar(id?: number) {
  return useQuery({ queryKey: ["cuentas-por-pagar", id], queryFn: () => cuentaPagarService.get(Number(id)), enabled: Boolean(id) })
}