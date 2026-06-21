import { Download, Eye, FileText, MoreHorizontal, RefreshCcw, SearchCheck, Send } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { useAuthStore } from "@/shared/stores/auth.store"

import { useComunicacionBajaActions } from "../hooks/useComunicacionBajaActions"
import type { ComunicacionBaja } from "../types/comunicacionBaja.types"

function canEnviar(comunicacion: ComunicacionBaja) {
  return comunicacion.estado === "REGISTRADA" && comunicacion.estado_sunat === "PENDIENTE"
}

function canReenviar(comunicacion: ComunicacionBaja) {
  return comunicacion.estado === "REGISTRADA" && comunicacion.estado_sunat !== "ACEPTADO" && comunicacion.estado_sunat !== "ENVIADO"
}

function canConsultar(comunicacion: ComunicacionBaja) {
  return comunicacion.estado !== "ANULADA" && comunicacion.estado_sunat !== "ACEPTADO" && Boolean(comunicacion.ticket_sunat)
}

export function ComunicacionBajaActions({ comunicacion }: { comunicacion: ComunicacionBaja }) {
  const navigate = useNavigate()
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const actions = useComunicacionBajaActions(comunicacion)
  const sending = actions.enviar.isPending || actions.reenviar.isPending

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Acciones de comunicacion de baja">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={() => navigate(`/comprobantes/comunicacion-baja/${comunicacion.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalle
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {hasPermission("comunicaciones_baja.enviar_sunat") ? (
          <GuiaConfirmAction
            title="Enviar comunicacion a SUNAT"
            description="Se enviara la Comunicacion de Baja y SUNAT devolvera un ticket para consultar el resultado."
            actionLabel="Enviar"
            disabled={!canEnviar(comunicacion) || sending}
            onConfirm={() => actions.enviar.mutate(comunicacion.id)}
          >
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!canEnviar(comunicacion) || sending}>
              <Send className="mr-2 h-4 w-4" />
              {actions.enviar.isPending ? "Enviando..." : "Enviar SUNAT"}
            </DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        {hasPermission("comunicaciones_baja.reenviar_sunat") ? (
          <GuiaConfirmAction
            title="Reenviar comunicacion a SUNAT"
            description="Confirma el reenvio solo si revisaste el estado y mensaje SUNAT de la comunicacion."
            actionLabel="Reenviar"
            disabled={!canReenviar(comunicacion) || sending}
            onConfirm={() => actions.reenviar.mutate(comunicacion.id)}
          >
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!canReenviar(comunicacion) || sending}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              {actions.reenviar.isPending ? "Reenviando..." : "Reenviar SUNAT"}
            </DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        {hasPermission("comunicaciones_baja.consultar_ticket") ? (
          <GuiaConfirmAction
            title="Consultar ticket"
            description="Se consultara el ticket SUNAT para actualizar el estado final y descargar CDR si esta disponible."
            actionLabel="Consultar"
            disabled={!canConsultar(comunicacion) || actions.consultarTicket.isPending}
            onConfirm={() => actions.consultarTicket.mutate(comunicacion.id)}
          >
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!canConsultar(comunicacion) || actions.consultarTicket.isPending}>
              <SearchCheck className="mr-2 h-4 w-4" />
              {actions.consultarTicket.isPending ? "Consultando..." : "Consultar ticket"}
            </DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        <DropdownMenuSeparator />

        {hasPermission("comunicaciones_baja.pdf.descargar") ? (
          <DropdownMenuItem disabled={actions.descargarPdf.isPending} onClick={() => actions.descargarPdf.mutate(comunicacion)}>
            <FileText className="mr-2 h-4 w-4" />
            {actions.descargarPdf.isPending ? "Abriendo PDF..." : comunicacion.tiene_pdf_a4 ? "Ver PDF" : "Generar y ver PDF"}
          </DropdownMenuItem>
        ) : null}

        {hasPermission("comunicaciones_baja.xml.descargar") ? (
          <DropdownMenuItem disabled={!comunicacion.tiene_xml || actions.descargarXml.isPending} onClick={() => actions.descargarXml.mutate(comunicacion)}>
            <Download className="mr-2 h-4 w-4" />
            {actions.descargarXml.isPending ? "Descargando XML..." : comunicacion.tiene_xml ? "Descargar XML" : "XML no disponible"}
          </DropdownMenuItem>
        ) : null}

        {hasPermission("comunicaciones_baja.cdr.descargar") ? (
          <DropdownMenuItem disabled={!comunicacion.tiene_cdr || actions.descargarCdr.isPending} onClick={() => actions.descargarCdr.mutate(comunicacion)}>
            <Download className="mr-2 h-4 w-4" />
            {actions.descargarCdr.isPending ? "Descargando CDR..." : comunicacion.tiene_cdr ? "Descargar CDR" : "CDR no disponible"}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
