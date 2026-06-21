import { Download, FileText, RefreshCcw, SearchCheck, Send } from "lucide-react"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { Button } from "@/shared/components/ui/button"
import { useAuthStore } from "@/shared/stores/auth.store"

import { useComunicacionBajaActions } from "../hooks/useComunicacionBajaActions"
import type { ComunicacionBaja } from "../types/comunicacionBaja.types"

export function ComunicacionBajaDocumentActions({ comunicacion }: { comunicacion: ComunicacionBaja }) {
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const actions = useComunicacionBajaActions(comunicacion)
  const canEnviar = comunicacion.estado === "REGISTRADA" && comunicacion.estado_sunat === "PENDIENTE"
  const canReenviar = comunicacion.estado === "REGISTRADA" && comunicacion.estado_sunat !== "ACEPTADO" && comunicacion.estado_sunat !== "ENVIADO"
  const canConsultar = comunicacion.estado !== "ANULADA" && comunicacion.estado_sunat !== "ACEPTADO" && Boolean(comunicacion.ticket_sunat)

  return (
    <div className="flex flex-wrap gap-2">
      {hasPermission("comunicaciones_baja.enviar_sunat") ? (
        <GuiaConfirmAction
          title="Enviar comunicacion a SUNAT"
          description="Se enviara la comunicacion y SUNAT devolvera un ticket para consultar el resultado."
          actionLabel="Enviar"
          disabled={!canEnviar || actions.enviar.isPending}
          onConfirm={() => actions.enviar.mutate(comunicacion.id)}
        >
          <Button variant="outline" disabled={!canEnviar || actions.enviar.isPending}>
            <Send className="mr-2 h-4 w-4" />
            {actions.enviar.isPending ? "Enviando..." : "Enviar SUNAT"}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {hasPermission("comunicaciones_baja.reenviar_sunat") ? (
        <GuiaConfirmAction
          title="Reenviar comunicacion a SUNAT"
          description="Confirma el reenvio solo si revisaste el mensaje SUNAT actual."
          actionLabel="Reenviar"
          disabled={!canReenviar || actions.reenviar.isPending}
          onConfirm={() => actions.reenviar.mutate(comunicacion.id)}
        >
          <Button variant="outline" disabled={!canReenviar || actions.reenviar.isPending}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {actions.reenviar.isPending ? "Reenviando..." : "Reenviar"}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {hasPermission("comunicaciones_baja.consultar_ticket") ? (
        <GuiaConfirmAction
          title="Consultar ticket SUNAT"
          description="Se actualizara el estado de la comunicacion y se guardara CDR si SUNAT lo devuelve."
          actionLabel="Consultar"
          disabled={!canConsultar || actions.consultarTicket.isPending}
          onConfirm={() => actions.consultarTicket.mutate(comunicacion.id)}
        >
          <Button variant="outline" disabled={!canConsultar || actions.consultarTicket.isPending}>
            <SearchCheck className="mr-2 h-4 w-4" />
            {actions.consultarTicket.isPending ? "Consultando..." : "Consultar ticket"}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {hasPermission("comunicaciones_baja.pdf.descargar") ? (
        <Button variant="outline" disabled={actions.descargarPdf.isPending} onClick={() => actions.descargarPdf.mutate(comunicacion)}>
          <FileText className="mr-2 h-4 w-4" />
          {actions.descargarPdf.isPending ? "Abriendo..." : "PDF"}
        </Button>
      ) : null}

      {hasPermission("comunicaciones_baja.xml.descargar") ? (
        <Button variant="outline" disabled={!comunicacion.tiene_xml || actions.descargarXml.isPending} onClick={() => actions.descargarXml.mutate(comunicacion)}>
          <Download className="mr-2 h-4 w-4" />
          XML
        </Button>
      ) : null}

      {hasPermission("comunicaciones_baja.cdr.descargar") ? (
        <Button variant="outline" disabled={!comunicacion.tiene_cdr || actions.descargarCdr.isPending} onClick={() => actions.descargarCdr.mutate(comunicacion)}>
          <Download className="mr-2 h-4 w-4" />
          CDR
        </Button>
      ) : null}
    </div>
  )
}
