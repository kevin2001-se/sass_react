import { Download, FileText, RefreshCcw, SearchCheck, Send } from "lucide-react"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { Button } from "@/shared/components/ui/button"
import { useAuthStore } from "@/shared/stores/auth.store"

import { useResumenDiarioActions } from "../hooks/useResumenDiarioActions"
import type { ResumenDiario } from "../types/resumenDiario.types"

function hasTicket(resumen: ResumenDiario) {
  return Boolean(resumen.ticket_sunat || resumen.ticket)
}

export function ResumenDiarioDocumentActions({ resumen }: { resumen: ResumenDiario }) {
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const actions = useResumenDiarioActions(resumen)
  const canEnviar = resumen.estado === "REGISTRADO" && resumen.estado_sunat === "PENDIENTE"
  const canReenviar = resumen.estado === "REGISTRADO" && resumen.estado_sunat !== "ACEPTADO" && resumen.estado_sunat !== "ENVIADO"
  const canConsultar = resumen.estado !== "ANULADO" && resumen.estado_sunat !== "ACEPTADO" && hasTicket(resumen)

  return (
    <div className="flex flex-wrap gap-2">
      {hasPermission("resumenes_diarios.enviar_sunat") ? (
        <GuiaConfirmAction
          title="Enviar resumen a SUNAT"
          description="Se enviara el resumen y SUNAT devolvera un ticket para consultar el resultado."
          actionLabel="Enviar"
          disabled={!canEnviar || actions.enviar.isPending}
          onConfirm={() => actions.enviar.mutate(resumen.id)}
        >
          <Button variant="outline" disabled={!canEnviar || actions.enviar.isPending}>
            <Send className="mr-2 h-4 w-4" />
            {actions.enviar.isPending ? "Enviando..." : "Enviar SUNAT"}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {hasPermission("resumenes_diarios.reenviar_sunat") ? (
        <GuiaConfirmAction
          title="Reenviar resumen a SUNAT"
          description="Confirma el reenvio solo si revisaste el mensaje SUNAT actual."
          actionLabel="Reenviar"
          disabled={!canReenviar || actions.reenviar.isPending}
          onConfirm={() => actions.reenviar.mutate(resumen.id)}
        >
          <Button variant="outline" disabled={!canReenviar || actions.reenviar.isPending}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {actions.reenviar.isPending ? "Reenviando..." : "Reenviar"}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {hasPermission("resumenes_diarios.consultar_ticket") ? (
        <GuiaConfirmAction
          title="Consultar ticket SUNAT"
          description="Se actualizara el estado del resumen y se guardara CDR si SUNAT lo devuelve."
          actionLabel="Consultar"
          disabled={!canConsultar || actions.consultarTicket.isPending}
          onConfirm={() => actions.consultarTicket.mutate(resumen.id)}
        >
          <Button variant="outline" disabled={!canConsultar || actions.consultarTicket.isPending}>
            <SearchCheck className="mr-2 h-4 w-4" />
            {actions.consultarTicket.isPending ? "Consultando..." : "Consultar ticket"}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {hasPermission("resumenes_diarios.pdf.descargar") ? (
        <Button variant="outline" disabled={actions.descargarPdf.isPending} onClick={() => actions.descargarPdf.mutate(resumen)}>
          <FileText className="mr-2 h-4 w-4" />
          {actions.descargarPdf.isPending ? "Abriendo..." : "PDF"}
        </Button>
      ) : null}

      {hasPermission("resumenes_diarios.xml.descargar") ? (
        <Button variant="outline" disabled={!resumen.tiene_xml || actions.descargarXml.isPending} onClick={() => actions.descargarXml.mutate(resumen)}>
          <Download className="mr-2 h-4 w-4" />
          XML
        </Button>
      ) : null}

      {hasPermission("resumenes_diarios.cdr.descargar") ? (
        <Button variant="outline" disabled={!resumen.tiene_cdr || actions.descargarCdr.isPending} onClick={() => actions.descargarCdr.mutate(resumen)}>
          <Download className="mr-2 h-4 w-4" />
          CDR
        </Button>
      ) : null}
    </div>
  )
}