import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { comprobanteService } from "@/modules/comprobantes/services/comprobante.service"
import { downloadBlob, openBlob } from "@/modules/pos/utils/downloadBlob"

function notifyError(error?: unknown) {
  const message =
    typeof error === "object" && error !== null && "response" in error
      ? (error as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ??
        (error as { response?: { data?: { message?: string; error?: string } } }).response?.data?.error
      : null

  toast.error(message ?? "No se pudo completar la accion solicitada.")
}

export function useComprobanteActions(id?: number) {
  const queryClient = useQueryClient()

  const invalidate = (comprobanteId?: number) => {
    queryClient.invalidateQueries({ queryKey: ["comprobantes"] })
    if (comprobanteId) queryClient.invalidateQueries({ queryKey: ["comprobante", comprobanteId] })
  }

  const reenviar = useMutation({
    mutationFn: (comprobanteId: number) => comprobanteService.reenviar(comprobanteId),
    onSuccess: (_, comprobanteId) => {
      toast.success("Comprobante reenviado correctamente.")
      invalidate(comprobanteId)
    },
    onError: notifyError,
  })

  const emitir = useMutation({
    mutationFn: (ventaId: number) => comprobanteService.emitir(ventaId),
    onSuccess: () => {
      toast.success("Comprobante enviado a SUNAT.")
      invalidate(id)
    },
    onError: notifyError,
  })

  const solicitarBaja = useMutation({
    mutationFn: ({ comprobanteId, motivo_baja }: { comprobanteId: number; motivo_baja: string }) =>
      comprobanteService.solicitarBaja(comprobanteId, { motivo_baja }),
    onSuccess: (_, variables) => {
      toast.success("Comprobante marcado como pendiente de baja.")
      invalidate(variables.comprobanteId)
    },
    onError: notifyError,
  })

  const descargar = async (comprobanteId: number, tipo: "pdf" | "ticket80" | "ticket58" | "xml" | "cdr", filename: string) => {
    try {
      if (tipo === "pdf") {
        await comprobanteService.generarPdfA4(comprobanteId)
        openBlob(await comprobanteService.descargarPdfA4(comprobanteId))
        return
      }
      if (tipo === "ticket80") {
        await comprobanteService.generarTicket80(comprobanteId)
        openBlob(await comprobanteService.descargarTicket80(comprobanteId))
        return
      }
      if (tipo === "ticket58") {
        openBlob(await comprobanteService.descargarTicket58(comprobanteId))
        return
      }
      if (tipo === "xml") {
        downloadBlob(await comprobanteService.descargarXml(comprobanteId), `${filename}.xml`)
        return
      }
      downloadBlob(await comprobanteService.descargarCdr(comprobanteId), `R-${filename}.zip`)
    } catch (error) {
      notifyError(error)
    }
  }

  return { reenviar, emitir, solicitarBaja, descargar }
}
