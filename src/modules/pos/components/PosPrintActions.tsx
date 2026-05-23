import { Download, FileText, Printer } from "lucide-react"
import { toast } from "sonner"

import { useGenerarPdfA4, useGenerarTicket58, useGenerarTicket80 } from "@/modules/pos/hooks/usePosDocumentos"
import { posDocumentoService } from "@/modules/pos/services/posDocumento.service"
import type { PosComprobanteElectronico } from "@/modules/pos/types/pos.types"
import { downloadBlob, openBlob } from "@/modules/pos/utils/downloadBlob"
import { Button } from "@/shared/components/ui/button"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function PosPrintActions({ comprobante }: { comprobante: PosComprobanteElectronico }) {
  const ticket80 = useGenerarTicket80()
  const ticket58 = useGenerarTicket58()
  const pdfA4 = useGenerarPdfA4()

  async function handleTicket80() {
    try {
      await ticket80.mutateAsync(comprobante.id)
      const blob = await posDocumentoService.descargarTicket80(comprobante.id)
      openBlob(blob)
      toast.success("Ticket 80mm generado.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "Documento no disponible."))
    }
  }

  async function handleTicket58() {
    try {
      await ticket58.mutateAsync(comprobante.id)
      const blob = await posDocumentoService.descargarTicket58(comprobante.id)
      openBlob(blob)
      toast.success("Ticket 58mm generado.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "Documento no disponible."))
    }
  }

  async function handlePdfA4() {
    try {
      await pdfA4.mutateAsync(comprobante.id)
      const blob = await posDocumentoService.descargarPdfA4(comprobante.id)
      downloadBlob(blob, `${comprobante.numero_comprobante}.pdf`)
      toast.success("PDF A4 generado.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "Documento no disponible."))
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Button disabled={ticket80.isPending} type="button" onClick={handleTicket80}>
        <Printer className="h-4 w-4" />
        {ticket80.isPending ? "Generando..." : "Ticket 80mm"}
      </Button>
      <Button disabled={ticket58.isPending} type="button" variant="outline" onClick={handleTicket58}>
        <Printer className="h-4 w-4" />
        Ticket 58mm
      </Button>
      <Button disabled={pdfA4.isPending} type="button" variant="outline" onClick={handlePdfA4}>
        <FileText className="h-4 w-4" />
        PDF A4
      </Button>
      <Button className="hidden" type="button" variant="ghost">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )
}
