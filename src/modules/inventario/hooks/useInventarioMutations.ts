import { useMutation, useQueryClient } from "@tanstack/react-query"

import { inventarioService } from "@/modules/inventario/services/inventario.service"
import { loteService } from "@/modules/inventario/services/lote.service"
import type {
  InventarioAjustePayload,
  InventarioEntradaPayload,
  InventarioSalidaPayload,
  LotePayload,
} from "@/modules/inventario/types/inventario.types"

function useInvalidateInventario() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ["inventario"] })
    queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  }
}

export function useEntradaInventario() {
  const invalidate = useInvalidateInventario()

  return useMutation({
    mutationFn: (payload: InventarioEntradaPayload) => inventarioService.entrada(payload),
    onSuccess: invalidate,
  })
}

export function useSalidaInventario() {
  const invalidate = useInvalidateInventario()

  return useMutation({
    mutationFn: (payload: InventarioSalidaPayload) => inventarioService.salida(payload),
    onSuccess: invalidate,
  })
}

export function useAjusteInventario() {
  const invalidate = useInvalidateInventario()

  return useMutation({
    mutationFn: (payload: InventarioAjustePayload) => inventarioService.ajuste(payload),
    onSuccess: invalidate,
  })
}

export function useCreateLote() {
  const invalidate = useInvalidateInventario()

  return useMutation({
    mutationFn: (payload: LotePayload) => loteService.createLote(payload),
    onSuccess: invalidate,
  })
}

export function useUpdateLote(id: number) {
  const invalidate = useInvalidateInventario()

  return useMutation({
    mutationFn: (payload: LotePayload) => loteService.updateLote(id, payload),
    onSuccess: invalidate,
  })
}

export function useDeleteLote() {
  const invalidate = useInvalidateInventario()

  return useMutation({
    mutationFn: (id: number) => loteService.deleteLote(id),
    onSuccess: invalidate,
  })
}

export function useCargaMasivaInventario() {
  const invalidate = useInvalidateInventario()

  return useMutation({
    mutationFn: (payload: { tipo: "entrada" | "salida" | "ajuste"; archivo: File; motivo?: string; tipo_ajuste?: "POSITIVO" | "NEGATIVO" }) =>
      inventarioService.cargaMasiva(payload.tipo, { archivo: payload.archivo, motivo: payload.motivo, tipo_ajuste: payload.tipo_ajuste }),
    onSuccess: invalidate,
  })
}

export function useCargaMasivaLotes() {
  const invalidate = useInvalidateInventario()

  return useMutation({
    mutationFn: (archivo: File) => loteService.cargaMasiva(archivo),
    onSuccess: invalidate,
  })
}