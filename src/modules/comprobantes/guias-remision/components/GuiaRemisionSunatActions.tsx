import { CheckCircle2, Download, RefreshCcw, Send } from "lucide-react"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { useRegistrarGuiaRemision } from "@/modules/comprobantes/guias-remision/hooks/useGuiaRemisionMutations"
import { useGuiaRemisionSunatActions } from "@/modules/comprobantes/guias-remision/hooks/useGuiaRemisionSunatActions"
import type { GuiaRemision } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { Button } from "@/shared/components/ui/button"
import { useAuthStore } from "@/shared/stores/auth.store"

type Props = {
  guia: GuiaRemision
}

function canEnviar(guia: GuiaRemision) {
  return guia.estado === "REGISTRADA" && guia.estado_sunat !== "ACEPTADO"
}

function canReenviar(guia: GuiaRemision) {
  return guia.estado === "REGISTRADA" && ["ERROR", "RECHAZADO"].includes(String(guia.estado_sunat ?? "PENDIENTE"))
}

function enviarLabel(guia: GuiaRemision) {
  if (guia.estado === "BORRADOR") return "Registre la guia antes de enviar"
  if (guia.estado === "ANULADA") return "Guia anulada"
  if (guia.estado_sunat === "ACEPTADO") return "Aceptada por SUNAT"
  return "Enviar SUNAT"
}

export function GuiaRemisionSunatActions({ guia }: Props) {
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const actions = useGuiaRemisionSunatActions(guia)
  const registrar = useRegistrarGuiaRemision()
  const canSeeEnviar = hasAnyPermission(["guias.enviar_sunat", "sunat.guias.enviar_sunat", "sunat.comprobantes.emitir"])
  const canSeeReenviar = hasAnyPermission(["guias.reenviar_sunat", "sunat.guias.reenviar_sunat", "sunat.comprobantes.reenviar"])
  const canSeeXml = hasAnyPermission(["guias.descargar_xml", "sunat.guias.descargar_xml", "sunat.documentos.descargar"])
  const canSeeCdr = hasAnyPermission(["guias.descargar_cdr", "sunat.guias.descargar_cdr", "sunat.documentos.descargar"])
  const enviarEnabled = canEnviar(guia)
  const reenviarEnabled = canReenviar(guia)

  return (
    <div className="flex flex-wrap gap-2">
      {canSeeEnviar && guia.estado === "BORRADOR" ? (
        <GuiaConfirmAction
          title="Registrar guia"
          description="La guia pasara de BORRADOR a REGISTRADA. Luego podras enviarla a SUNAT."
          actionLabel="Registrar"
          disabled={registrar.isPending}
          onConfirm={() => registrar.mutate(guia.id)}
        >
          <Button variant="outline" disabled={registrar.isPending}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {registrar.isPending ? "Registrando..." : "Registrar guia"}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {canSeeEnviar ? (
        <GuiaConfirmAction
          title="Enviar guia a SUNAT"
          description="Se enviara la Guia de Remision Electronica Remitente a SUNAT usando la configuracion GRE activa de la empresa."
          actionLabel="Enviar"
          disabled={!enviarEnabled || actions.enviar.isPending}
          onConfirm={() => actions.enviar.mutate()}
        >
          <Button variant="outline" disabled={!enviarEnabled || actions.enviar.isPending}>
            <Send className="mr-2 h-4 w-4" />
            {actions.enviar.isPending ? "Enviando..." : enviarLabel(guia)}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {canSeeReenviar ? (
        <GuiaConfirmAction
          title="Reenviar guia a SUNAT"
          description="La guia tiene estado SUNAT con error o rechazo. Confirma el reenvio solo si ya revisaste el mensaje de SUNAT."
          actionLabel="Reenviar"
          disabled={!reenviarEnabled || actions.reenviar.isPending}
          onConfirm={() => actions.reenviar.mutate()}
        >
          <Button variant="outline" disabled={!reenviarEnabled || actions.reenviar.isPending}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {actions.reenviar.isPending ? "Reenviando..." : reenviarEnabled ? "Reenviar" : "Reenviar si falla"}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {canSeeXml ? (
        <Button variant="outline" disabled={!guia.tiene_xml || actions.descargarXml.isPending} onClick={() => actions.descargarXml.mutate()}>
          <Download className="mr-2 h-4 w-4" />
          {actions.descargarXml.isPending ? "Descargando..." : guia.tiene_xml ? "XML" : "XML no disponible"}
        </Button>
      ) : null}

      {canSeeCdr ? (
        <Button variant="outline" disabled={!guia.tiene_cdr || actions.descargarCdr.isPending} onClick={() => actions.descargarCdr.mutate()}>
          <Download className="mr-2 h-4 w-4" />
          {actions.descargarCdr.isPending ? "Descargando..." : guia.tiene_cdr ? "CDR" : "CDR no disponible"}
        </Button>
      ) : null}
    </div>
  )
}
