import { useMutation, useQueryClient } from "@tanstack/react-query"

import { posVentaService } from "@/modules/pos/services/posVenta.service"
import type { PosVentaPayload } from "@/modules/pos/types/pos.types"
import { generateIdempotencyKey } from "@/modules/pos/utils/idempotency"

export function useRegistrarVentaPos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PosVentaPayload) => posVentaService.registrarVenta(payload, generateIdempotencyKey()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caja", "abierta"] })
      queryClient.invalidateQueries({ queryKey: ["stocks"] })
      queryClient.invalidateQueries({ queryKey: ["ventas"] })
      queryClient.invalidateQueries({ queryKey: ["cuentas-por-cobrar"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["pos", "productos"] })
    },
  })
}
