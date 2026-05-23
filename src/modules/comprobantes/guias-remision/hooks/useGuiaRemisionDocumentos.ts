import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { guiaRemisionDocumentoService } from "@/modules/comprobantes/guias-remision/services/guiaRemisionDocumento.service"
import type { GuiaRemision } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { downloadBlob, openBlob, openPrintableBlob } from "@/shared/utils/blob"
import { getLaravelErrorMessage } from "@/shared/services/api"

function baseName(guia: GuiaRemision) {
  return guia.numero_completo || guia.numero_guia || `guia-${guia.id}`
}

export function useGuiaRemisionDocumentos(guia: GuiaRemision) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["guias-remision"] })
    queryClient.invalidateQueries({ queryKey: ["guias-remision", guia.id] })
  }

  const generarPdf = useMutation({
    mutationFn: () => guiaRemisionDocumentoService.generarPdfA4(guia.id),
    onSuccess: () => {
      toast.success("PDF generado correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo generar el PDF.")),
  })

  const generarTicket = useMutation({
    mutationFn: () => guiaRemisionDocumentoService.generarTicket80(guia.id),
    onSuccess: () => {
      toast.success("Ticket generado correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo generar el ticket.")),
  })

  const generarFormatos = useMutation({
    mutationFn: () => guiaRemisionDocumentoService.generarFormatos(guia.id),
    onSuccess: () => {
      toast.success("Formatos generados correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudieron generar los formatos.")),
  })

  const verPdf = useMutation({
    mutationFn: async () => {
      if (!guia.tiene_pdf_a4) await guiaRemisionDocumentoService.generarPdfA4(guia.id)
      return guiaRemisionDocumentoService.descargarPdfA4(guia.id)
    },
    onSuccess: (blob) => {
      if (!openBlob(blob)) downloadBlob(blob, `${baseName(guia)}.pdf`)
      toast.success("PDF listo.")
      invalidate()
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo abrir el PDF.")),
  })

  const verTicket = useMutation({
    mutationFn: async () => {
      if (!guia.tiene_ticket_80) await guiaRemisionDocumentoService.generarTicket80(guia.id)
      return guiaRemisionDocumentoService.descargarTicket80(guia.id)
    },
    onSuccess: (blob) => {
      if (!openBlob(blob)) downloadBlob(blob, `${baseName(guia)}-ticket-80.pdf`)
      toast.success("Ticket listo.")
      invalidate()
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo abrir el ticket.")),
  })

  const imprimirTicket = useMutation({
    mutationFn: async () => {
      if (!guia.tiene_ticket_80) await guiaRemisionDocumentoService.generarTicket80(guia.id)
      return guiaRemisionDocumentoService.descargarTicket80(guia.id)
    },
    onSuccess: (blob) => {
      if (!openPrintableBlob(blob)) {
        downloadBlob(blob, `${baseName(guia)}-ticket-80.pdf`)
        toast.warning("El navegador bloqueo la ventana de impresion. Se descargo el ticket.")
      } else {
        toast.success("Ticket abierto para impresion.")
      }
      invalidate()
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo imprimir el ticket.")),
  })

  return { generarPdf, generarTicket, generarFormatos, verPdf, verTicket, imprimirTicket }
}
