import { useQuery } from "@tanstack/react-query"
import { cuentaPagarService } from "@/modules/compras/cuentas-pagar/services/cuentaPagar.service"
import type { CuentaPagarFilters } from "@/modules/compras/cuentas-pagar/types/cuentaPagar.types"

export function useCuentasPagar(filters: CuentaPagarFilters) {
  return useQuery({ queryKey: ["cuentas-por-pagar", filters], queryFn: () => cuentaPagarService.list(filters) })
}