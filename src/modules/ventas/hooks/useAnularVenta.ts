import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ventaService } from "@/modules/ventas/services/venta.service"
import type { AnularVentaPayload } from "@/modules/ventas/types/venta.types"

export function useAnularVenta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AnularVentaPayload }) => ventaService.anularVenta(id, payload),
    onSuccess: async (_venta, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["ventas"] }),
        queryClient.invalidateQueries({ queryKey: ["ventas", variables.id] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["caja"] }),
        queryClient.invalidateQueries({ queryKey: ["cajas"] }),
        queryClient.invalidateQueries({ queryKey: ["stock"] }),
        queryClient.invalidateQueries({ queryKey: ["pos-productos"] }),
      ])
    },
  })
}