import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import type { NotaCreditoFormValues } from "@/modules/comprobantes/notas-credito/schemas/notaCredito.schema"
import { notaCreditoService } from "@/modules/comprobantes/notas-credito/services/notaCredito.service"
import type { LaravelErrorResponse } from "@/shared/services/api"

export function useCrearNotaCredito() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: NotaCreditoFormValues) => notaCreditoService.crearNotaCredito(payload),
    onSuccess: () => {
      toast.success("Nota de credito registrada correctamente.")
      queryClient.invalidateQueries({ queryKey: ["notas-credito"] })
      queryClient.invalidateQueries({ queryKey: ["comprobantes"] })
    },
    onError: (error) => {
      const axiosError = error as AxiosError<LaravelErrorResponse & { error?: string }>
      toast.error(axiosError.response?.data?.error ?? axiosError.response?.data?.message ?? "No se pudo registrar la nota de credito.")
    },
  })
}