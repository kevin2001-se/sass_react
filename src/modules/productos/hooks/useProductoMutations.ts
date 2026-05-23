import { useMutation, useQueryClient } from "@tanstack/react-query"

import { productoService } from "@/modules/productos/services/producto.service"
import type { ProductoPayload } from "@/modules/productos/types/producto.types"

export function useCreateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProductoPayload) => productoService.createProducto(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}

export function useUpdateProducto(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProductoPayload) => productoService.updateProducto(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      queryClient.invalidateQueries({ queryKey: ["productos", id] })
    },
  })
}

export function useDeleteProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productoService.deleteProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}
