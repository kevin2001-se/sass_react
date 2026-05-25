import { useMutation, useQueryClient } from "@tanstack/react-query"
import { proveedorService } from "@/modules/compras/proveedores/services/proveedor.service"
import type { ProveedorFormValues } from "@/modules/compras/proveedores/types/proveedor.types"

export function useProveedorMutations() {
  const queryClient = useQueryClient()
  return {
    create: useMutation({ mutationFn: proveedorService.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["compras", "proveedores"] }) }),
    update: useMutation({ mutationFn: ({ id, values }: { id: number; values: ProveedorFormValues }) => proveedorService.update(id, values), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["compras", "proveedores"] }) }),
    remove: useMutation({ mutationFn: proveedorService.remove, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["compras", "proveedores"] }) }),
  }
}