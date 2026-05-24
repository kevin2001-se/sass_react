import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { notaCreditoSunatService } from "@/modules/comprobantes/notas-credito/services/notaCreditoSunat.service"
import type { NotaCredito } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { downloadBlob } from "@/shared/utils/blob"
import type { LaravelErrorResponse } from "@/shared/services/api"

function filename(nota: NotaCredito, extension: string) {
  return `${nota.numero_completo || `nota-credito-${nota.id}`}.${extension}`
}

function errorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<LaravelErrorResponse & { error?: string }>
  return axiosError.response?.data?.error ?? axiosError.response?.data?.message ?? fallback
}

export function useNotaCreditoSunatActions(nota: NotaCredito) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notas-credito"] })
    queryClient.invalidateQueries({ queryKey: ["notas-credito", nota.id] })
  }

  const enviar = useMutation({
    mutationFn: () => notaCreditoSunatService.enviarSunat(nota.id),
    onSuccess: () => {
      toast.success("Nota de credito enviada a SUNAT correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo enviar la nota de credito a SUNAT.")),
  })

  const reenviar = useMutation({
    mutationFn: () => notaCreditoSunatService.reenviarSunat(nota.id),
    onSuccess: () => {
      toast.success("Nota de credito reenviada a SUNAT correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo reenviar la nota de credito a SUNAT.")),
  })

  const descargarXml = useMutation({
    mutationFn: () => notaCreditoSunatService.descargarXml(nota.id),
    onSuccess: (blob) => {
      downloadBlob(blob, filename(nota, "xml"))
      toast.success("XML descargado correctamente.")
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo descargar el XML.")),
  })

  const descargarCdr = useMutation({
    mutationFn: () => notaCreditoSunatService.descargarCdr(nota.id),
    onSuccess: (blob) => {
      downloadBlob(blob, `R-${filename(nota, "zip")}`)
      toast.success("CDR descargado correctamente.")
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo descargar el CDR.")),
  })

  return { enviar, reenviar, descargarXml, descargarCdr }
}