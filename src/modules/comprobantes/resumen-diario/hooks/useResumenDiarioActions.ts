import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getLaravelErrorMessage } from "@/shared/services/api"
import { downloadBlob, openBlob } from "@/shared/utils/blob"

import { resumenDiarioService } from "../services/resumenDiario.service"
import type { GenerarResumenDiarioPayload, ResumenDiario } from "../types/resumenDiario.types"

function invalidateResumenes(queryClient: ReturnType<typeof useQueryClient>, id?: number | string) {
  queryClient.invalidateQueries({ queryKey: ["resumenes-diarios"] })
  if (id) {
    queryClient.invalidateQueries({ queryKey: ["resumenes-diarios", id] })
  }
}

function filename(resumen: Pick<ResumenDiario, "identificador" | "id"> | undefined, extension: string) {
  return `${resumen?.identificador ?? `resumen-${resumen?.id ?? "diario"}`}.${extension}`
}

export function useResumenDiarioActions(resumen?: ResumenDiario) {
  const queryClient = useQueryClient()

  const generar = useMutation({
    mutationFn: (payload: GenerarResumenDiarioPayload) => resumenDiarioService.generar(payload),
    onSuccess: () => {
      toast.success("Resumen diario generado correctamente.")
      invalidateResumenes(queryClient)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo generar el resumen diario.")),
  })

  const enviar = useMutation({
    mutationFn: (id: number | string) => resumenDiarioService.enviarSunat(id),
    onSuccess: (data) => {
      toast.success("Resumen enviado a SUNAT correctamente.")
      invalidateResumenes(queryClient, data?.id ?? resumen?.id)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo enviar el resumen a SUNAT.")),
  })

  const reenviar = useMutation({
    mutationFn: (id: number | string) => resumenDiarioService.reenviarSunat(id),
    onSuccess: (data) => {
      toast.success("Resumen reenviado a SUNAT correctamente.")
      invalidateResumenes(queryClient, data?.id ?? resumen?.id)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo reenviar el resumen a SUNAT.")),
  })

  const consultarTicket = useMutation({
    mutationFn: (id: number | string) => resumenDiarioService.consultarTicket(id),
    onSuccess: (data) => {
      toast.success("Ticket consultado correctamente.")
      invalidateResumenes(queryClient, data?.id ?? resumen?.id)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo consultar el ticket SUNAT.")),
  })

  const generarPdf = useMutation({
    mutationFn: (id: number | string) => resumenDiarioService.generarPdfA4(id),
    onSuccess: (data) => {
      toast.success("PDF generado correctamente.")
      invalidateResumenes(queryClient, data?.id ?? resumen?.id)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo generar el PDF.")),
  })

  const descargarPdf = useMutation({
    mutationFn: async (target: ResumenDiario) => {
      if (!target.tiene_pdf_a4) {
        await resumenDiarioService.generarPdfA4(target.id)
        invalidateResumenes(queryClient, target.id)
      }
      return resumenDiarioService.descargarPdfA4(target.id)
    },
    onSuccess: (blob, target) => {
      if (!openBlob(blob)) {
        downloadBlob(blob, filename(target, "pdf"))
        toast.message("PDF generado. Abre el archivo descargado para verlo.")
      }
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo abrir el PDF.")),
  })

  const descargarXml = useMutation({
    mutationFn: (target: ResumenDiario) => resumenDiarioService.descargarXml(target.id),
    onSuccess: (blob, target) => downloadBlob(blob, filename(target, "xml")),
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo descargar el XML.")),
  })

  const descargarCdr = useMutation({
    mutationFn: (target: ResumenDiario) => resumenDiarioService.descargarCdr(target.id),
    onSuccess: (blob, target) => downloadBlob(blob, `R-${filename(target, "zip")}`),
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo descargar el CDR.")),
  })

  return {
    generar,
    enviar,
    reenviar,
    consultarTicket,
    generarPdf,
    descargarPdf,
    descargarXml,
    descargarCdr,
    isSending: enviar.isPending || reenviar.isPending,
    isConsulting: consultarTicket.isPending,
    isPdfLoading: generarPdf.isPending || descargarPdf.isPending,
    isXmlLoading: descargarXml.isPending,
    isCdrLoading: descargarCdr.isPending,
  }
}