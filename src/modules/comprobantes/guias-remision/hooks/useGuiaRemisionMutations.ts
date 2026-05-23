import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { guiaRemisionService } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"
import type { GuiaDesdeVentaFormValues, GuiaRemisionFormValues } from "@/modules/comprobantes/guias-remision/schemas/guiaRemision.schema"
import type { LaravelErrorResponse } from "@/shared/services/api"

export function useCrearGuiaRemision() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: GuiaRemisionFormValues) => guiaRemisionService.crearGuiaManual(payload),
    onSuccess: () => {
      toast.success("Guia de remision creada correctamente.")
      queryClient.invalidateQueries({ queryKey: ["guias-remision"] })
    },
    onError: (error) => {
      const axiosError = error as AxiosError<LaravelErrorResponse>
      toast.error(axiosError.response?.data?.message ?? "No se pudo crear la guia de remision.")
    },
  })
}

export function useCrearGuiaDesdeVenta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ventaId, payload }: { ventaId: number; payload: GuiaDesdeVentaFormValues }) => guiaRemisionService.crearGuiaDesdeVenta(ventaId, payload),
    onSuccess: () => {
      toast.success("Guia creada desde venta correctamente.")
      queryClient.invalidateQueries({ queryKey: ["guias-remision"] })
    },
    onError: (error) => {
      const axiosError = error as AxiosError<LaravelErrorResponse>
      toast.error(axiosError.response?.data?.message ?? "No se pudo crear la guia desde venta.")
    },
  })
}
export function useAnularGuiaRemision() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) => guiaRemisionService.anularGuia(id, motivo),
    onSuccess: (_data, variables) => {
      toast.success("Guia anulada correctamente.")
      queryClient.invalidateQueries({ queryKey: ["guias-remision"] })
      queryClient.invalidateQueries({ queryKey: ["guias-remision", variables.id] })
    },
    onError: (error) => {
      const axiosError = error as AxiosError<LaravelErrorResponse>
      toast.error(axiosError.response?.data?.message ?? "No se pudo anular la guia.")
    },
  })
}
export function useRegistrarGuiaRemision() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => guiaRemisionService.registrarGuia(id),
    onSuccess: (_data, id) => {
      toast.success("Guia registrada correctamente. Ya puede enviarla a SUNAT.")
      queryClient.invalidateQueries({ queryKey: ["guias-remision"] })
      queryClient.invalidateQueries({ queryKey: ["guias-remision", id] })
    },
    onError: (error) => {
      const axiosError = error as AxiosError<LaravelErrorResponse>
      toast.error((axiosError.response?.data as { error?: string } | undefined)?.error ?? axiosError.response?.data?.message ?? "No se pudo registrar la guia.")
    },
  })
}

