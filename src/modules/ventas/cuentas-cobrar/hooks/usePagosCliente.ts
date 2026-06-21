import { useQuery } from "@tanstack/react-query"
import { pagoClienteService } from "../services/pagoCliente.service"
import type { PagoClienteFilters } from "../types/cuentaCobrar.types"
export const pagosClienteQueryKey = (filters?: PagoClienteFilters) => ["pagos-cliente", filters ?? {}] as const
export function usePagosCliente(filters: PagoClienteFilters) { return useQuery({ queryKey: pagosClienteQueryKey(filters), queryFn: () => pagoClienteService.list(filters) }) }
