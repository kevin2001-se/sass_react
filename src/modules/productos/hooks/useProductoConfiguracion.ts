import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { productoConfiguracionService } from "@/modules/productos/services/productoConfiguracion.service"
import type { ProductoConfiguracionPayload } from "@/modules/productos/types/producto.types"

export function useProductoConfiguracion() {
  return useQuery({
    queryKey: ["productos", "configuracion"],
    queryFn: () => productoConfiguracionService.getConfiguracion(),
  })
}

export function useUpdateProductoConfiguracion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProductoConfiguracionPayload) =>
      productoConfiguracionService.updateConfiguracion(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos", "configuracion"] }),
  })
}
