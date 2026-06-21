import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { cuentaCobrarService } from "../services/cuentaCobrar.service"
import { pagoClienteService } from "../services/pagoCliente.service"
import type { AnularPagoClientePayload, RegistrarPagoClientePayload } from "../types/cuentaCobrar.types"

export function useRegistrarPagoCliente(cuentaId?: number | string) {
  const queryClient = useQueryClient()
  return useMutation<any, unknown, RegistrarPagoClientePayload>({
    mutationFn: (payload: RegistrarPagoClientePayload) => cuentaId ? cuentaCobrarService.pagar(cuentaId, payload) : pagoClienteService.registrar(payload),
    onSuccess: () => {
      toast.success("Pago registrado correctamente.")
      queryClient.invalidateQueries({ queryKey: ["cuentas-por-cobrar"] })
      queryClient.invalidateQueries({ queryKey: ["pagos-cliente"] })
      if (cuentaId) queryClient.invalidateQueries({ queryKey: ["cuentas-por-cobrar", cuentaId] })
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo registrar el pago.")),
  })
}

export function useAnularPagoCliente() {
  const queryClient = useQueryClient()
  return useMutation<any, unknown, { id: number | string; payload: AnularPagoClientePayload }>({
    mutationFn: ({ id, payload }) => pagoClienteService.anular(id, payload),
    onSuccess: () => {
      toast.success("Pago anulado correctamente.")
      queryClient.invalidateQueries({ queryKey: ["cuentas-por-cobrar"] })
      queryClient.invalidateQueries({ queryKey: ["pagos-cliente"] })
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo anular el pago.")),
  })
}
