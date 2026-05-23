import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { guiaRemisionSunatService } from "@/modules/comprobantes/guias-remision/services/guiaRemisionSunat.service"
import type { GuiaRemision } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { downloadBlob } from "@/shared/utils/blob"
import { getLaravelErrorMessage } from "@/shared/services/api"

function filename(guia: GuiaRemision, extension: string) {
  const numero = guia.numero_completo || guia.numero_guia || `guia-${guia.id}`
  return `${numero}.${extension}`
}

export function useGuiaRemisionSunatActions(guia: GuiaRemision) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["guias-remision"] })
    queryClient.invalidateQueries({ queryKey: ["guias-remision", guia.id] })
  }

  const enviar = useMutation({
    mutationFn: () => guiaRemisionSunatService.enviarSunat(guia.id),
    onSuccess: () => {
      toast.success("Guia enviada a SUNAT correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo enviar la guia a SUNAT.")),
  })

  const reenviar = useMutation({
    mutationFn: () => guiaRemisionSunatService.reenviarSunat(guia.id),
    onSuccess: () => {
      toast.success("Guia reenviada a SUNAT correctamente.")
      invalidate()
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo reenviar la guia a SUNAT.")),
  })

  const descargarXml = useMutation({
    mutationFn: () => guiaRemisionSunatService.descargarXml(guia.id),
    onSuccess: (blob) => {
      downloadBlob(blob, filename(guia, "xml"))
      toast.success("XML descargado correctamente.")
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo descargar el XML.")),
  })

  const descargarCdr = useMutation({
    mutationFn: () => guiaRemisionSunatService.descargarCdr(guia.id),
    onSuccess: (blob) => {
      downloadBlob(blob, `R-${filename(guia, "zip")}`)
      toast.success("CDR descargado correctamente.")
    },
    onError: (error) => toast.error(getLaravelErrorMessage(error, "No se pudo descargar el CDR.")),
  })

  return { enviar, reenviar, descargarXml, descargarCdr }
}
