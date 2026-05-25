import { useMutation, useQueryClient } from "@tanstack/react-query"
import { compraService } from "@/modules/compras/compras/services/compra.service"
import type { AnularCompraPayload, CompraPayload } from "@/modules/compras/compras/types/compra.types"

export function useCompraMutations() {
  const queryClient = useQueryClient()

  const registrar = useMutation({
    mutationFn: (values: CompraPayload) => compraService.registrar(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] })
      queryClient.invalidateQueries({ queryKey: ["inventario"] })
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })

  const anular = useMutation({
    mutationFn: ({ id, values }: { id: number; values: AnularCompraPayload }) => compraService.anular(id, values),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["compras"] })
      queryClient.invalidateQueries({ queryKey: ["compras", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["inventario"] })
    },
  })

  return { registrar, anular }
}
