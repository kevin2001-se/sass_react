import { useQuery } from "@tanstack/react-query"
import { cuentaCobrarService } from "../services/cuentaCobrar.service"
import type { CuentaCobrarFilters } from "../types/cuentaCobrar.types"
export const cuentasCobrarQueryKey = (filters?: CuentaCobrarFilters) => ["cuentas-por-cobrar", filters ?? {}] as const
export function useCuentasCobrar(filters: CuentaCobrarFilters) { return useQuery({ queryKey: cuentasCobrarQueryKey(filters), queryFn: () => cuentaCobrarService.list(filters) }) }
