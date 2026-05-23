import { useMutation, useQueryClient } from "@tanstack/react-query"

import { cajaService } from "@/modules/caja/services/caja.service"
import type { AperturarCajaPayload, CerrarCajaPayload, RegistrarMovimientoCajaPayload } from "@/modules/caja/types/caja.types"

function useInvalidateCaja() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["caja"] })
    queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  }
}

export function useAperturarCaja() {
  const invalidate = useInvalidateCaja()
  return useMutation({
    mutationFn: (payload: AperturarCajaPayload) => cajaService.aperturar(payload),
    onSuccess: invalidate,
  })
}

export function useCerrarCaja(id: number) {
  const invalidate = useInvalidateCaja()
  return useMutation({
    mutationFn: (payload: CerrarCajaPayload) => cajaService.cerrar(id, payload),
    onSuccess: invalidate,
  })
}

export function useRegistrarIngresoCaja() {
  const invalidate = useInvalidateCaja()
  return useMutation({
    mutationFn: (payload: RegistrarMovimientoCajaPayload) => cajaService.registrarIngreso(payload),
    onSuccess: invalidate,
  })
}

export function useRegistrarEgresoCaja() {
  const invalidate = useInvalidateCaja()
  return useMutation({
    mutationFn: (payload: RegistrarMovimientoCajaPayload) => cajaService.registrarEgreso(payload),
    onSuccess: invalidate,
  })
}
