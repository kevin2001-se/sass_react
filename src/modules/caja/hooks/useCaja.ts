import { useQuery } from "@tanstack/react-query"

import { cajaService } from "@/modules/caja/services/caja.service"
import type { CajaMovimientoFilters } from "@/modules/caja/types/caja.types"

export function useCajaAbierta() {
  return useQuery({
    queryKey: ["caja", "abierta"],
    queryFn: () => cajaService.getCajaAbierta(),
  })
}

export function useCaja(id?: number) {
  return useQuery({
    queryKey: ["caja", id],
    queryFn: () => cajaService.getCaja(id as number),
    enabled: Boolean(id),
  })
}

export function useArqueoCaja(id?: number) {
  return useQuery({
    queryKey: ["caja", id, "arqueo"],
    queryFn: () => cajaService.getArqueo(id as number),
    enabled: Boolean(id),
  })
}

export function useCajaMovimientos(filters: CajaMovimientoFilters = {}) {
  return useQuery({
    queryKey: ["caja", "movimientos", filters],
    queryFn: () => cajaService.getMovimientos(filters),
  })
}
