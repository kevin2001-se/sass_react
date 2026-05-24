import { Download, Eye, FileArchive, FileText, MoreHorizontal, RefreshCcw, Send, Ticket } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { useNotaDebitoDocumentos } from "@/modules/comprobantes/notas-debito/hooks/useNotaDebitoDocumentos"
import { useNotaDebitoSunatActions } from "@/modules/comprobantes/notas-debito/hooks/useNotaDebitoSunatActions"
import type { NotaDebito } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { useAuthStore } from "@/shared/stores/auth.store"

function canEnviar(nota: NotaDebito) {
  return nota.estado === "REGISTRADA" && nota.estado_sunat !== "ACEPTADO"
}

function canReenviar(nota: NotaDebito) {
  return nota.estado === "REGISTRADA" && ["ERROR", "RECHAZADO"].includes(String(nota.estado_sunat ?? "PENDIENTE"))
}

export function NotaDebitoActions({ nota }: { nota: NotaDebito }) {
  const navigate = useNavigate()
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const sunat = useNotaDebitoSunatActions(nota)
  const docs = useNotaDebitoDocumentos(nota)
  const canSeeEnviar = hasAnyPermission(["notas_debito.enviar_sunat"])
  const canSeeReenviar = hasAnyPermission(["notas_debito.reenviar_sunat"])
  const canSeeXml = hasAnyPermission(["notas_debito.descargar_xml", "notas_debito.xml.descargar"])
  const canSeeCdr = hasAnyPermission(["notas_debito.descargar_cdr", "notas_debito.cdr.descargar"])
  const canGeneratePdf = hasAnyPermission(["notas_debito.pdf.generar"])
  const canDownloadPdf = hasAnyPermission(["notas_debito.pdf.descargar"])
  const canGenerateTicket = hasAnyPermission(["notas_debito.ticket.generar"])
  const canDownloadTicket = hasAnyPermission(["notas_debito.ticket.descargar"])
  const enviarEnabled = canEnviar(nota)
  const reenviarEnabled = canReenviar(nota)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Acciones de nota de debito"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem onClick={() => navigate(`/comprobantes/notas-debito/${nota.id}`)}><Eye className="mr-2 h-4 w-4" />Ver detalle</DropdownMenuItem>
        <DropdownMenuSeparator />

        {canSeeEnviar ? (
          <GuiaConfirmAction title="Enviar nota de debito a SUNAT" description="Se enviara la Nota de Debito Electronica a SUNAT usando la configuracion activa de la empresa." actionLabel="Enviar" disabled={!enviarEnabled || sunat.enviar.isPending} onConfirm={() => sunat.enviar.mutate()}>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!enviarEnabled || sunat.enviar.isPending}><Send className="mr-2 h-4 w-4" />{sunat.enviar.isPending ? "Enviando..." : enviarEnabled ? "Enviar SUNAT" : "No se puede enviar"}</DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        {canSeeReenviar ? (
          <GuiaConfirmAction title="Reenviar nota de debito a SUNAT" description="La nota tiene estado SUNAT con error o rechazo. Confirma el reenvio solo si ya revisaste el mensaje de SUNAT." actionLabel="Reenviar" disabled={!reenviarEnabled || sunat.reenviar.isPending} onConfirm={() => sunat.reenviar.mutate()}>
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