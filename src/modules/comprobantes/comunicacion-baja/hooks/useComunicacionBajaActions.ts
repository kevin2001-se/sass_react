import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getLaravelErrorMessage } from "@/shared/services/api"
import { downloadBlob, openBlob } from "@/shared/utils/blob"

import { comunicacionBajaService } from "../services/comunicacionBaja.service"
import type { ComunicacionBaja, GenerarComunicacionBajaPayload } from "../types/comunicacionBaja.types"

function invalidateComunicaciones(queryClient: ReturnType<typeof useQueryClient>, id?: number | string) {
  queryClient.invalidateQueries({ queryKey: ["comunicaciones-baja"] })
  if (id) queryClient.invalidateQueries({ queryKey: ["comunicaciones-baja", id] })
}

function filename(comunicacion: Pick<ComunicacionBaja, "identificador" | "id"> | undefined, extension: string) {
  return `${comunicacion?.identificador ?? `comunicacion-baja-${comunicacion?.id ?? "documento"}`}.${extension}`
}

export function useComunicacionBajaActions(comunicacion?: ComunicacionBaja) {
  const queryClient = useQueryClient()

  const generar = useMutation({
    mutationFn: (payload: GenerarComunicacionBajaPayload) => comunicacionBajaService.generar(payload),
    onSuccess: () => {
      toast.success("Comunicacion de baja generada correctamente.")
      invalidateComunicaciones(queryClient)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo generar la comunicacion de baja.")),
  })

  const enviar = useMutation({
    mutationFn: (id: number | string) => comunicacionBajaService.enviarSunat(id),
    onSuccess: (data) => {
      toast.success("Comunicacion enviada a SUNAT correctamente.")
      invalidateComunicaciones(queryClient, data?.id ?? comunicacion?.id)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo enviar la comunicacion a SUNAT.")),
  })

  const reenviar = useMutation({
    mutationFn: (id: number | string) => comunicacionBajaService.reenviarSunat(id),
    onSuccess: (data) => {
      toast.success("Comunicacion reenviada a SUNAT correctamente.")
      invalidateComunicaciones(queryClient, data?.id ?? comunicacion?.id)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo reenviar la comunicacion a SUNAT.")),
  })

  const consultarTicket = useMutation({
    mutationFn: (id: number | string) => comunicacionBajaService.consultarTicket(id),
    onSuccess: (data) => {
      toast.success("Ticket consultado correctamente.")
      invalidateComunicaciones(queryClient, data?.id ?? comunicacion?.id)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo consultar el ticket SUNAT.")),
  })

  const generarPdf = useMutation({
    mutationFn: (id: number | string) => comunicacionBajaService.generarPdfA4(id),
    onSuccess: (data) => {
      toast.success("PDF generado correctamente.")
      invalidateComunicaciones(queryClient, data?.id ?? comunicacion?.id)
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo generar el PDF.")),
  })

  const descargarPdf = useMutation({
    mutationFn: async (target: ComunicacionBaja) => {
      if (!target.tiene_pdf_a4) {
        await comunicacionBajaService.generarPdfA4(target.id)
        invalidateComunicaciones(queryClient, target.id)
      }
      return comunicacionBajaService.descargarPdfA4(target.id)
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
    mutationFn: (target: ComunicacionBaja) => comunicacionBajaService.descargarXml(target.id),
    onSuccess: (blob, target) => downloadBlob(blob, filename(target, "xml")),
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo descargar el XML.")),
  })

  const descargarCdr = useMutation({
    mutationFn: (target: ComunicacionBaja) => comunicacionBajaService.descargarCdr(target.id),
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
