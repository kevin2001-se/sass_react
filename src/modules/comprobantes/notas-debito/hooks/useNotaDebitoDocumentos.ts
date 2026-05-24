import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import { notaDebitoDocumentoService } from "@/modules/comprobantes/notas-debito/services/notaDebitoDocumento.service"
import type { NotaDebito } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import type { LaravelErrorResponse } from "@/shared/services/api"
import { downloadBlob, openBlob, printBlob } from "@/shared/utils/blob"

function baseName(nota: NotaDebito) {
  return nota.numero_completo || `nota-debito-${nota.id}`
}

function errorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<LaravelErrorResponse & { error?: string }>
  return axiosError.response?.data?.error ?? axiosError.response?.data?.message ?? fallback
}

export function useNotaDebitoDocumentos(nota: NotaDebito) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notas-debito"] })
    queryClient.invalidateQueries({ queryKey: ["notas-debito", nota.id] })
  }

  const generarPdf = useMutation({
    mutationFn: () => notaDebitoDocumentoService.generarPdfA4(nota.id),
    onSuccess: () => {
      toast.success("PDF generado correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo generar el PDF.")),
  })

  const generarTicket = useMutation({
    mutationFn: () => notaDebitoDocumentoService.generarTicket80(nota.id),
    onSuccess: () => {
      toast.success("Ticket generado correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudo generar el ticket.")),
  })

  const generarFormatos = useMutation({
    mutationFn: () => notaDebitoDocumentoService.generarFormatos(nota.id),
    onSuccess: () => {
      toast.success("Formatos generados correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(errorMessage(error, "No se pudieron generar los formatos.")),
  })

  const verPdf = useMutation({
    mutationFn: async () => {
      if (!nota.tiene_pdf_a4) await notaDebitoDocumentoService.generarPdfA4(nota.id)
      return notaDebitoDocumentoService.descargarPdfA4(nota.id)
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
      if (!nota.tiene_ticket_80) await notaDebitoDocumentoService.generarTicket80(nota.id)
      return notaDebitoDocumentoService.descargarTicket80(nota.id)
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
      if (!nota.tiene_ticket_80) await notaDebitoDocumentoService.generarTicket80(nota.id)
      return notaDebitoDocumentoService.descargarTicket80(nota.id)
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