import { CheckCircle2, Download, Eye, FileText, MoreHorizontal, Pencil, RefreshCcw, Send, Ticket, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { useGuiaRemisionDocumentos } from "@/modules/comprobantes/guias-remision/hooks/useGuiaRemisionDocumentos"
import { useAnularGuiaRemision, useRegistrarGuiaRemision } from "@/modules/comprobantes/guias-remision/hooks/useGuiaRemisionMutations"
import { useGuiaRemisionSunatActions } from "@/modules/comprobantes/guias-remision/hooks/useGuiaRemisionSunatActions"
import type { GuiaRemision } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { useAuthStore } from "@/shared/stores/auth.store"

function canEnviar(guia: GuiaRemision) {
  return guia.estado === "REGISTRADA" && guia.estado_sunat !== "ACEPTADO"
}

function canReenviar(guia: GuiaRemision) {
  return guia.estado === "REGISTRADA" && ["ERROR", "RECHAZADO"].includes(String(guia.estado_sunat ?? "PENDIENTE"))
}

function enviarDisabledReason(guia: GuiaRemision) {
  if (guia.estado === "BORRADOR") return "Registre la guia antes de enviarla"
  if (guia.estado === "ANULADA") return "La guia anulada no se puede enviar"
  if (guia.estado_sunat === "ACEPTADO") return "La guia ya fue aceptada"
  return "Enviar SUNAT"
}

export function GuiaRemisionActions({ guia }: { guia: GuiaRemision }) {
  const navigate = useNavigate()
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const sunat = useGuiaRemisionSunatActions(guia)
  const docs = useGuiaRemisionDocumentos(guia)
  const anular = useAnularGuiaRemision()
  const registrar = useRegistrarGuiaRemision()
  const canSeeEnviar = hasAnyPermission(["guias.enviar_sunat", "sunat.guias.enviar_sunat", "sunat.comprobantes.emitir"])
  const canSeeReenviar = hasAnyPermission(["guias.reenviar_sunat", "sunat.guias.reenviar_sunat", "sunat.comprobantes.reenviar"])
  const canSeeXml = hasAnyPermission(["guias.descargar_xml", "sunat.guias.descargar_xml", "sunat.documentos.descargar"])
  const canSeeCdr = hasAnyPermission(["guias.descargar_cdr", "sunat.guias.descargar_cdr", "sunat.documentos.descargar"])
  const enviarEnabled = canEnviar(guia)
  const reenviarEnabled = canReenviar(guia)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Acciones de guia">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={() => navigate(`/comprobantes/guias-remision/${guia.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalle
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={guia.estado !== "BORRADOR"}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <GuiaConfirmAction
          title="Registrar guia"
          description="La guia pasara de BORRADOR a REGISTRADA. Luego podras enviarla a SUNAT."
          actionLabel="Registrar"
          disabled={guia.estado !== "BORRADOR" || registrar.isPending}
          onConfirm={() => registrar.mutate(guia.id)}
        >
          <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={guia.estado !== "BORRADOR" || registrar.isPending}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {registrar.isPending ? "Registrando..." : guia.estado === "BORRADOR" ? "Registrar guia" : "Guia registrada"}
          </DropdownMenuItem>
        </GuiaConfirmAction>
        <GuiaConfirmAction
          title="Anular guia"
          description="La guia cambiara a estado ANULADA. Confirma esta accion solo si corresponde operativamente."
          actionLabel="Anular"
          disabled={guia.estado === "ANULADA" || anular.isPending}
          onConfirm={() => anular.mutate({ id: guia.id, motivo: "Anulacion desde frontend" })}
        >
          <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={guia.estado === "ANULADA" || anular.isPending}>
            <XCircle className="mr-2 h-4 w-4" />
            {anular.isPending ? "Anulando..." : "Anular guia"}
          </DropdownMenuItem>
        </GuiaConfirmAction>

        {(canSeeEnviar || canSeeReenviar || canSeeXml || canSeeCdr) ? <DropdownMenuSeparator /> : null}

        {canSeeEnviar ? (
          <GuiaConfirmAction
            title="Enviar guia a SUNAT"
            description="Se enviara la Guia de Remision Electronica Remitente a SUNAT usando la configuracion GRE activa de la empresa."
            actionLabel="Enviar"
            disabled={!enviarEnabled || sunat.enviar.isPending}
            onConfirm={() => sunat.enviar.mutate()}
          >
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!enviarEnabled || sunat.enviar.isPending}>
              <Send className="mr-2 h-4 w-4" />
              {sunat.enviar.isPending ? "Enviando..." : enviarDisabledReason(guia)}
            </DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        {canSeeReenviar ? (
          <GuiaConfirmAction
            title="Reenviar guia a SUNAT"
            description="La guia tiene estado SUNAT con error o rechazo. Confirma el reenvio solo si ya revisaste el mensaje de SUNAT."
            actionLabel="Reenviar"
            disabled={!reenviarEnabled || sunat.reenviar.isPending}
            onConfirm={() => sunat.reenviar.mutate()}
          >
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!reenviarEnabled || sunat.reenviar.isPending}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              {sunat.reenviar.isPending ? "Reenviando..." : reenviarEnabled ? "Reenviar SUNAT" : "Reenviar solo si hay error/rechazo"}
            </DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        {canSeeXml ? (
          <DropdownMenuItem disabled={!guia.tiene_xml || sunat.descargarXml.isPending} onClick={() => sunat.descargarXml.mutate()}>
            <Download className="mr-2 h-4 w-4" />
            {sunat.descargarXml.isPending ? "Descargando XML..." : guia.tiene_xml ? "Descargar XML" : "XML no disponible"}
          </DropdownMenuItem>
        ) : null}
        {canSeeCdr ? (
          <DropdownMenuItem disabled={!guia.tiene_cdr || sunat.descargarCdr.isPending} onClick={() => sunat.descargarCdr.mutate()}>
            <Download className="mr-2 h-4 w-4" />
            {sunat.descargarCdr.isPending ? "Descargando CDR..." : guia.tiene_cdr ? "Descargar CDR" : "CDR no disponible"}
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />
        {hasPermission("guias.pdf.generar") ? (
          <DropdownMenuItem disabled={docs.generarPdf.isPending} onClick={() => docs.generarPdf.mutate()}>
            <FileText className="mr-2 h-4 w-4" />
            {docs.generarPdf.isPending ? "Generando PDF..." : "Generar PDF"}
          </DropdownMenuItem>
        ) : null}
        {hasPermission("guias.pdf.descargar") ? (
          <DropdownMenuItem disabled={docs.verPdf.isPending} onClick={() => docs.verPdf.mutate()}>
            <FileText className="mr-2 h-4 w-4" />
            {docs.verPdf.isPending ? "Abriendo PDF..." : "Ver PDF"}
          </DropdownMenuItem>
        ) : null}
        {hasPermission("guias.ticket.generar") ? (
          <DropdownMenuItem disabled={docs.generarTicket.isPending} onClick={() => docs.generarTicket.mutate()}>
            <Ticket className="mr-2 h-4 w-4" />
            {docs.generarTicket.isPending ? "Generando ticket..." : "Generar ticket"}
          </DropdownMenuItem>
        ) : null}
        {hasPermission("guias.ticket.descargar") ? (
          <DropdownMenuItem disabled={docs.imprimirTicket.isPending} onClick={() => docs.imprimirTicket.mutate()}>
            <Ticket className="mr-2 h-4 w-4" />
            {docs.imprimirTicket.isPending ? "Imprimiendo..." : "Imprimir ticket"}
          </DropdownMenuItem>
        ) : null}
        {hasPermission("guias.pdf.generar") || hasPermission("guias.ticket.generar") ? (
          <DropdownMenuItem disabled={docs.generarFormatos.isPending} onClick={() => docs.generarFormatos.mutate()}>
            <FileText className="mr-2 h-4 w-4" />
            {docs.generarFormatos.isPending ? "Generando formatos..." : "Generar formatos"}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


