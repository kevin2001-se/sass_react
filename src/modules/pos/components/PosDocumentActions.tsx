import { FileArchive, RefreshCw, Send } from "lucide-react"
import { toast } from "sonner"

import { useEmitirSunat, useReenviarSunat } from "@/modules/pos/hooks/usePosSunatActions"
import { posDocumentoService } from "@/modules/pos/services/posDocumento.service"
import type { PosComprobanteElectronico, PosVentaRegistrada } from "@/modules/pos/types/pos.types"
import { downloadBlob } from "@/modules/pos/utils/downloadBlob"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function PosDocumentActions({
  sale,
  comprobante,
  onComprobanteUpdated,
}: {
  sale: PosVentaRegistrada
  comprobante?: PosComprobanteElectronico | null
  onComprobanteUpdated?: (comprobante: PosComprobanteElectronico) => void
}) {
  const emitir = useEmitirSunat()
  const reenviar = useReenviarSunat()
  const noAplica = sale.tipo_comprobante === "NOTA_VENTA"
  const accepted = comprobante?.estado_sunat === "ACEPTADO"
  const canReenviar = comprobante && ["ERROR", "RECHAZADO", "PENDIENTE"].includes(comprobante.estado_sunat)
  const canEnviar = !noAplica && !comprobante

  async function emitSunat() {
    try {
      const response = await emitir.mutateAsync(sale.id)
      onComprobanteUpdated?.(response)
      toast.success("Comprobante enviado a SUNAT.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "SUNAT no pudo procesar el comprobante."))
    }
  }

  async function resendSunat() {
    if (!comprobante) return
    try {
      const response = await reenviar.mutateAsync(comprobante.id)
      onComprobanteUpdated?.(response)
      toast.success("Comprobante reenviado a SUNAT.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo reenviar a SUNAT."))
    }
  }

  async function downloadXml() {
    if (!comprobante) return
    try {
      const blob = await posDocumentoService.descargarXml(comprobante.id)
      downloadBlob(blob, `${comprobante.numero_comprobante}.xml`)
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "XML no disponible."))
    }
  }

  async function downloadCdr() {
    if (!comprobante) return
    try {
      const blob = await posDocumentoService.descargarCdr(comprobante.id)
      downloadBlob(blob, `R-${comprobante.numero_comprobante}.zip`)
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "CDR no disponible."))
    }
  }

  if (noAplica) {
    return (
      <Alert>
        <AlertTitle>No aplica SUNAT</AlertTitle>
        <AlertDescription>La nota de venta es un documento interno. No genera XML ni CDR.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-3">
      {!accepted && (
        <Alert>
          <AlertTitle>Estado SUNAT</AlertTitle>
          <AlertDescription>El CDR estara disponible cuando SUNAT acepte el comprobante.</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {canEnviar && (
          <Button disabled={emitir.isPending} type="button" onClick={emitSunat}>
            <Send className="h-4 w-4" />
            {emitir.isPending ? "Enviando..." : "Enviar a SUNAT"}
          </Button>
        )}
        {canReenviar && (
          <Button disabled={reenviar.isPending} type="button" variant="outline" onClick={resendSunat}>
            <RefreshCw className="h-4 w-4" />
            {reenviar.isPending ? "Reenviando..." : "Reenviar SUNAT"}
          </Button>
        )}
        {comprobante && (
          <>
            <Button disabled={!comprobante.tiene_xml && !accepted} type="button" variant="outline" onClick={downloadXml}>
              <FileArchive className="h-4 w-4" />
              XML
            </Button>
            <Button disabled={!comprobante.tiene_cdr && !accepted} type="button" variant="outline" onClick={downloadCdr}>
              <FileArchive className="h-4 w-4" />
              CDR
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
