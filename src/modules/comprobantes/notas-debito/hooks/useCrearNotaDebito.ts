import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import type { NotaDebitoFormValues } from "@/modules/comprobantes/notas-debito/schemas/notaDebito.schema"
import { notaDebitoService } from "@/modules/comprobantes/notas-debito/services/notaDebito.service"
import type { LaravelErrorResponse } from "@/shared/services/api"

export function useCrearNotaDebito() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: NotaDebitoFormValues) => notaDebitoService.crearNotaDebito(payload),
    onSuccess: () => {
      toast.success("Nota de debito registrada correctamente.")
      queryClient.invalidateQueries({ queryKey: ["notas-debito"] })
      queryClient.invalidateQueries({ queryKey: ["comprobantes"] })
    },
    onError: (error) => {
      const axiosError = error as AxiosError<LaravelErrorResponse & { error?: string }>
      toast.error(axiosError.response?.data?.error ?? axiosError.response?.data?.message ?? "No se pudo registrar la nota de debito.")
    },
  })
}