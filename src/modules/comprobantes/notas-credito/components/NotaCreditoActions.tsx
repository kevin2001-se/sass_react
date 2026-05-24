import { Download, Eye, FileArchive, FileText, MoreHorizontal, RefreshCcw, Send, Ticket } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { useNotaCreditoDocumentos } from "@/modules/comprobantes/notas-credito/hooks/useNotaCreditoDocumentos"
import { useNotaCreditoSunatActions } from "@/modules/comprobantes/notas-credito/hooks/useNotaCreditoSunatActions"
import type { NotaCredito } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { useAuthStore } from "@/shared/stores/auth.store"

function canEnviar(nota: NotaCredito) {
  return nota.estado === "REGISTRADA" && nota.estado_sunat !== "ACEPTADO"
}

function canReenviar(nota: NotaCredito) {
  return nota.estado === "REGISTRADA" && ["ERROR", "RECHAZADO"].includes(String(nota.estado_sunat ?? "PENDIENTE"))
}

export function NotaCreditoActions({ nota }: { nota: NotaCredito }) {
  const navigate = useNavigate()
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const sunat = useNotaCreditoSunatActions(nota)
  const docs = useNotaCreditoDocumentos(nota)
  const canSeeEnviar = hasAnyPermission(["notas_credito.enviar_sunat"])
  const canSeeReenviar = hasAnyPermission(["notas_credito.reenviar_sunat"])
  const canSeeXml = hasAnyPermission(["notas_credito.descargar_xml", "notas_credito.xml.descargar"])
  const canSeeCdr = hasAnyPermission(["notas_credito.descargar_cdr", "notas_credito.cdr.descargar"])
  const canGeneratePdf = hasAnyPermission(["notas_credito.pdf.generar"])
  const canDownloadPdf = hasAnyPermission(["notas_credito.pdf.descargar"])
  const canGenerateTicket = hasAnyPermission(["notas_credito.ticket.generar"])
  const canDownloadTicket = hasAnyPermission(["notas_credito.ticket.descargar"])
  const enviarEnabled = canEnviar(nota)
  const reenviarEnabled = canReenviar(nota)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Acciones de nota de credito"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem onClick={() => navigate(`/comprobantes/notas-credito/${nota.id}`)}><Eye className="mr-2 h-4 w-4" />Ver detalle</DropdownMenuItem>
        <DropdownMenuSeparator />

        {canSeeEnviar ? (
          <GuiaConfirmAction title="Enviar nota de credito a SUNAT" description="Se enviara la Nota de Credito Electronica a SUNAT usando la configuracion activa de la empresa." actionLabel="Enviar" disabled={!enviarEnabled || sunat.enviar.isPending} onConfirm={() => sunat.enviar.mutate()}>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!enviarEnabled || sunat.enviar.isPending}><Send className="mr-2 h-4 w-4" />{sunat.enviar.isPending ? "Enviando..." : enviarEnabled ? "Enviar SUNAT" : "No se puede enviar"}</DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        {canSeeReenviar ? (
          <GuiaConfirmAction title="Reenviar nota de credito a SUNAT" description="La nota tiene estado SUNAT con error o rechazo. Confirma el reenvio solo si ya revisaste el mensaje de SUNAT." actionLabel="Reenviar" disabled={!reenviarEnabled || sunat.reenviar.isPending} onConfirm={() => sunat.reenviar.mutate()}>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!reenviarEnabled || sunat.reenviar.isPending}><RefreshCcw className="mr-2 h-4 w-4" />{sunat.reenviar.isPending ? "Reenviando..." : reenviarEnabled ? "Reenviar SUNAT" : "Reenviar si falla"}</DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        {canSeeXml ? <DropdownMenuItem disabled={!nota.tiene_xml || sunat.descargarXml.isPending} onClick={() => sunat.descargarXml.mutate()}><Download className="mr-2 h-4 w-4" />{sunat.descargarXml.isPending ? "Descargando XML..." : nota.tiene_xml ? "Descargar XML" : "XML no disponible"}</DropdownMenuItem> : null}
        {canSeeCdr ? <DropdownMenuItem disabled={!nota.tiene_cdr || sunat.descargarCdr.isPending} onClick={() => sunat.descargarCdr.mutate()}><FileArchive className="mr-2 h-4 w-4" />{sunat.descargarCdr.isPending ? "Descargando CDR..." : nota.tiene_cdr ? "Descargar CDR" : "CDR no disponible"}</DropdownMenuItem> : null}

        <DropdownMenuSeparator />
        {canGeneratePdf ? <DropdownMenuItem disabled={docs.generarPdf.isPending} onClick={() => docs.generarPdf.mutate()}><FileText className="mr-2 h-4 w-4" />{docs.generarPdf.isPending ? "Generando PDF..." : "Generar PDF"}</DropdownMenuItem> : null}
        {canDownloadPdf ? <DropdownMenuItem disabled={docs.verPdf.isPending} onClick={() => docs.verPdf.mutate()}><FileText className="mr-2 h-4 w-4" />{docs.verPdf.isPending ? "Abriendo PDF..." : "Ver PDF"}</DropdownMenuItem> : null}
        {canGenerateTicket ? <DropdownMenuItem disabled={docs.generarTicket.isPending} onClick={() => docs.generarTicket.mutate()}><Ticket className="mr-2 h-4 w-4" />{docs.generarTicket.isPending ? "Generando ticket..." : "Generar ticket"}</DropdownMenuItem> : null}
        {canDownloadTicket ? <DropdownMenuItem disabled={docs.imprimirTicket.isPending} onClick={() => docs.imprimirTicket.mutate()}><Ticket className="mr-2 h-4 w-4" />{docs.imprimirTicket.isPending ? "Imprimiendo..." : "Imprimir ticket"}</DropdownMenuItem> : null}
        {canGeneratePdf || canGenerateTicket ? <DropdownMenuItem disabled={docs.generarFormatos.isPending} onClick={() => docs.generarFormatos.mutate()}><FileText className="mr-2 h-4 w-4" />{docs.generarFormatos.isPending ? "Generando formatos..." : "Generar formatos"}</DropdownMenuItem> : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}