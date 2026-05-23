import { useMutation, useQueryClient } from "@tanstack/react-query"

import { posClienteService } from "@/modules/pos/services/posCliente.service"
import type { PosClientePayload } from "@/modules/pos/types/posCliente.types"

export function useCreatePosCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PosClientePayload) => posClienteService.crear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "clientes"] })
    },
  })
}

export function useUpdatePosCustomer(id?: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PosClientePayload) => {
      if (!id) throw new Error("Cliente no valido.")
      return posClienteService.actualizar(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "clientes"] })
    },
  })
}
