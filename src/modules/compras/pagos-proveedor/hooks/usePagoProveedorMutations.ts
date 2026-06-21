import { useMutation, useQueryClient } from "@tanstack/react-query"
import { pagoProveedorService } from "@/modules/compras/pagos-proveedor/services/pagoProveedor.service"
import type { AnularPagoProveedorPayload, PagoProveedorFormValues } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"

export function usePagoProveedorMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["pagos-proveedor"] })
    queryClient.invalidateQueries({ queryKey: ["cuentas-por-pagar"] })
    queryClient.invalidateQueries({ queryKey: ["caja"] })
  }

  return {
    crear: useMutation({ mutationFn: (values: PagoProveedorFormValues) => pagoProveedorService.create(values), onSuccess: invalidate }),
    anular: useMutation({ mutationFn: ({ id, values }: { id: number; values: AnularPagoProveedorPayload }) => pagoProveedorService.anular(id, values), onSuccess: invalidate }),
  }
}