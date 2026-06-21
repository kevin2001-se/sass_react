import { useQuery } from "@tanstack/react-query"
import { cuentaCobrarService } from "../services/cuentaCobrar.service"
export const cuentaCobrarQueryKey = (id?: number | string) => ["cuentas-por-cobrar", id] as const
export function useCuentaCobrar(id?: number | string) { return useQuery({ queryKey: cuentaCobrarQueryKey(id), queryFn: () => cuentaCobrarService.get(id as number | string), enabled: Boolean(id) }) }
