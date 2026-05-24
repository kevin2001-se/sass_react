import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { notaCreditoDocumentoService } from "@/modules/comprobantes/notas-credito/services/notaCreditoDocumento.service"
import type { NotaCredito } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import type { LaravelErrorResponse } from "@/shared/services/api"
import { downloadBlob, openBlob, printBlob } from "@/shared/utils/blob"

function baseName(nota: NotaCredito) {
  return nota.numero_completo || `nota-credito-${nota.id}`
}

function errorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<LaravelErrorResponse & { error?: string }>
  return axiosError.response?.data?.error ?? axiosError.response?.data?.message ?? fallback
}

export function useNotaCreditoDocumentos(nota: NotaCredito) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notas-credito"] })
    queryClient.invalidateQueries({ queryKey: ["notas-credito", nota.id] })
  }

  const generarPdf = useMutation({
    mutationFn: () => notaCreditoDocumentoService.generarPdfA4(nota.id),
    onSuccess: () => {
      toast.success("PDF generado correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo generar el PDF.")),
  })

  const generarTicket = useMutation({
    mutationFn: () => notaCreditoDocumentoService.generarTicket80(nota.id),
    onSuccess: () => {
      toast.success("Ticket generado correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo generar el ticket.")),
  })

  const generarFormatos = useMutation({
    mutationFn: () => notaCreditoDocumentoService.generarFormatos(nota.id),
    onSuccess: () => {
      toast.success("Formatos generados correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudieron generar los formatos.")),
  })

  const verPdf = useMutation({
    mutationFn: async () => {
      if (!nota.tiene_pdf_a4) await notaCreditoDocumentoService.generarPdfA4(nota.id)
      return notaCreditoDocumentoService.descargarPdfA4(nota.id)
    },
    onSuccess: (blob) => {
      if (!openBlob(blob)) downloadBlob(blob, `${baseName(nota)}.pdf`)
      toast.success("PDF listo.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo abrir el PDF.")),
  })

  const verTicket = useMutation({
    mutationFn: async () => {
      if (!nota.tiene_ticket_80) await notaCreditoDocumentoService.generarTicket80(nota.id)
      return notaCreditoDocumentoService.descargarTicket80(nota.id)
    },
    onSuccess: (blob) => {
      if (!openBlob(blob)) downloadBlob(blob, `${baseName(nota)}-ticket-80.pdf`)
      toast.success("Ticket listo.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo abrir el ticket.")),
  })

  const imprimirTicket = useMutation({
    mutationFn: async () => {
      if (!nota.tiene_ticket_80) await notaCreditoDocumentoService.generarTicket80(nota.id)
      return notaCreditoDocumentoService.descargarTicket80(nota.id)
    },
    onSuccess: (blob) => {
      if (!printBlob(blob)) {
        downloadBlob(blob, `${baseName(nota)}-ticket-80.pdf`)
        toast.warning("El navegador bloqueo la ventana de impresion. Se descargo el ticket.")
      } else {
        toast.success("Ticket abierto para impresion.")
      }
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo imprimir el ticket.")),
  })

  return { generarPdf, generarTicket, generarFormatos, verPdf, verTicket, imprimirTicket }
}