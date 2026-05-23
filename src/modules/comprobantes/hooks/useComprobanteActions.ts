import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { comprobanteService } from "@/modules/comprobantes/services/comprobante.service"
import { downloadBlob, openBlob } from "@/modules/pos/utils/downloadBlob"

function notifyError() {
  toast.error("No se pudo completar la accion solicitada.")
}

export function useComprobanteActions() {
  const queryClient = useQueryClient()

  const reenviar = useMutation({
    mutationFn: (id: number) => comprobanteService.reenviar(id),
    onSuccess: () => {
      toast.success("Comprobante reenviado correctamente.")
      queryClient.invalidateQueries({ queryKey: ["comprobantes"] })
    },
    onError: notifyError,
  })

  const emitir = useMutation({
    mutationFn: (ventaId: number) => comprobanteService.emitir(ventaId),
    onSuccess: () => {
      toast.success("Comprobante enviado a SUNAT.")
      queryClient.invalidateQueries({ queryKey: ["comprobantes"] })
    },
    onError: notifyError,
  })

  const descargar = async (id: number, tipo: "pdf" | "ticket80" | "ticket58" | "xml" | "cdr", filename: string) => {
    try {
      if (tipo === "pdf") {
        await comprobanteService.generarPdfA4(id)
        openBlob(await comprobanteService.descargarPdfA4(id))
        return
      }
      if (tipo === "ticket80") {
        await comprobanteService.generarTicket80(id)
        openBlob(await comprobanteService.descargarTicket80(id))
        return
      }
      if (tipo === "ticket58") {
        openBlob(await comprobanteService.descargarTicket58(id))
        return
      }
      if (tipo === "xml") {
        downloadBlob(await comprobanteService.descargarXml(id), `${filename}.xml`)
        return
      }
      downloadBlob(await comprobanteService.descargarCdr(id), `R-${filename}.zip`)
    } catch (error) {
      notifyError()
    }
  }

  return { reenviar, emitir, descargar }
}