import { Download, Eye, FileText, MoreHorizontal, RefreshCcw, SearchCheck, Send } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { useAuthStore } from "@/shared/stores/auth.store"

import { useResumenDiarioActions } from "../hooks/useResumenDiarioActions"
import type { ResumenDiario } from "../types/resumenDiario.types"

function hasTicket(resumen: ResumenDiario) {
  return Boolean(resumen.ticket_sunat || resumen.ticket)
}

function canEnviar(resumen: ResumenDiario) {
  return resumen.estado === "REGISTRADO" && resumen.estado_sunat === "PENDIENTE"
}

function canReenviar(resumen: ResumenDiario) {
  return resumen.estado === "REGISTRADO" && resumen.estado_sunat !== "ACEPTADO" && resumen.estado_sunat !== "ENVIADO"
}

function canConsultar(resumen: ResumenDiario) {
  return resumen.estado !== "ANULADO" && resumen.estado_sunat !== "ACEPTADO" && hasTicket(resumen)
}

export function ResumenDiarioActions({ resumen }: { resumen: ResumenDiario }) {
  const navigate = useNavigate()
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const actions = useResumenDiarioActions(resumen)

  const sending = actions.enviar.isPending || actions.reenviar.isPending

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Acciones de resumen diario">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={() => navigate(`/comprobantes/resumen-diario/${resumen.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalle
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {hasPermission("resumenes_diarios.enviar_sunat") ? (
          <GuiaConfirmAction
            title="Enviar resumen a SUNAT"
            description="Se enviara el Resumen Diario y SUNAT devolvera un ticket para consultar el resultado."
            actionLabel="Enviar"
            disabled={!canEnviar(resumen) || sending}
            onConfirm={() => actions.enviar.mutate(resumen.id)}
          >
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!canEnviar(resumen) || sending}>
              <Send className="mr-2 h-4 w-4" />
              {actions.enviar.isPending ? "Enviando..." : "Enviar SUNAT"}
            </DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        {hasPermission("resumenes_diarios.reenviar_sunat") ? (
          <GuiaConfirmAction
            title="Reenviar resumen a SUNAT"
            description="Confirma el reenvio solo si revisaste el estado y mensaje SUNAT del resumen."
            actionLabel="Reenviar"
            disabled={!canReenviar(resumen) || sending}
            onConfirm={() => actions.reenviar.mutate(resumen.id)}
          >
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!canReenviar(resumen) || sending}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              {actions.reenviar.isPending ? "Reenviando..." : "Reenviar SUNAT"}
            </DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        {hasPermission("resumenes_diarios.consultar_ticket") ? (
          <GuiaConfirmAction
            title="Consultar ticket"
            description="Se consultara el ticket SUNAT para actualizar el estado final y descargar CDR si esta disponible."
            actionLabel="Consultar"
            disabled={!canConsultar(resumen) || actions.consultarTicket.isPending}
            onConfirm={() => actions.consultarTicket.mutate(resumen.id)}
          >
            <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled={!canConsultar(resumen) || actions.consultarTicket.isPending}>
              <SearchCheck className="mr-2 h-4 w-4" />
              {actions.consultarTicket.isPending ? "Consultando..." : "Consultar ticket"}
            </DropdownMenuItem>
          </GuiaConfirmAction>
        ) : null}

        <DropdownMenuSeparator />

        {hasPermission("resumenes_diarios.pdf.descargar") ? (
          <DropdownMenuItem disabled={actions.descargarPdf.isPending} onClick={() => actions.descargarPdf.mutate(resumen)}>
            <FileText className="mr-2 h-4 w-4" />
            {actions.descargarPdf.isPending ? "Abriendo PDF..." : resumen.tiene_pdf_a4 ? "Ver PDF" : "Generar y ver PDF"}
          </DropdownMenuItem>
        ) : null}

        {hasPermission("resumenes_diarios.xml.descargar") ? (
          <DropdownMenuItem disabled={!resumen.tiene_xml || actions.descargarXml.isPending} onClick={() => actions.descargarXml.mutate(resumen)}>
            <Download className="mr-2 h-4 w-4" />
            {actions.descargarXml.isPending ? "Descargando XML..." : resumen.tiene_xml ? "Descargar XML" : "XML no disponible"}
          </DropdownMenuItem>
        ) : null}

        {hasPermission("resumenes_diarios.cdr.descargar") ? (
          <DropdownMenuItem disabled={!resumen.tiene_cdr || actions.descargarCdr.isPending} onClick={() => actions.descargarCdr.mutate(resumen)}>
            <Download className="mr-2 h-4 w-4" />
            {actions.descargarCdr.isPending ? "Descargando CDR..." : resumen.tiene_cdr ? "Descargar CDR" : "CDR no disponible"}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}