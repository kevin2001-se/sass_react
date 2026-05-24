import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { notaDebitoSunatService } from "@/modules/comprobantes/notas-debito/services/notaDebitoSunat.service"
import type { NotaDebito } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { downloadBlob } from "@/shared/utils/blob"
import type { LaravelErrorResponse } from "@/shared/services/api"

function filename(nota: NotaDebito, extension: string) {
  return `${nota.numero_completo || `nota-debito-${nota.id}`}.${extension}`
}

function errorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<LaravelErrorResponse & { error?: string }>
  return axiosError.response?.data?.error ?? axiosError.response?.data?.message ?? fallback
}

export function useNotaDebitoSunatActions(nota: NotaDebito) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notas-debito"] })
    queryClient.invalidateQueries({ queryKey: ["notas-debito", nota.id] })
  }

  const enviar = useMutation({
    mutationFn: () => notaDebitoSunatService.enviarSunat(nota.id),
    onSuccess: () => {
      toast.success("Nota de debito enviada a SUNAT correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo enviar la nota de debito a SUNAT.")),
  })

  const reenviar = useMutation({
    mutationFn: () => notaDebitoSunatService.reenviarSunat(nota.id),
    onSuccess: () => {
      toast.success("Nota de debito reenviada a SUNAT correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo reenviar la nota de debito a SUNAT.")),
  })

  const descargarXml = useMutation({
    mutationFn: () => notaDebitoSunatService.descargarXml(nota.id),
    onSuccess: (blob) => {
      downloadBlob(blob, filename(nota, "xml"))
      toast.success("XML descargado correctamente.")
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo descargar el XML.")),
  })

  const descargarCdr = useMutation({
    mutationFn: () => notaDebitoSunatService.descargarCdr(nota.id),
    onSuccess: (blob) => {
      downloadBlob(blob, `R-${filename(nota, "zip")}`)
      toast.success("CDR descargado correctamente.")
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo descargar el CDR.")),
  })

  return { enviar, reenviar, descargarXml, descargarCdr }
}