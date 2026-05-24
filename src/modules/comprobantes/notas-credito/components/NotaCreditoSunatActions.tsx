import { Download, RefreshCcw, Send } from "lucide-react"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { useNotaCreditoSunatActions } from "@/modules/comprobantes/notas-credito/hooks/useNotaCreditoSunatActions"
import type { NotaCredito } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { Button } from "@/shared/components/ui/button"
import { useAuthStore } from "@/shared/stores/auth.store"

function canEnviar(nota: NotaCredito) {
  return nota.estado === "REGISTRADA" && nota.estado_sunat !== "ACEPTADO"
}

function canReenviar(nota: NotaCredito) {
  return nota.estado === "REGISTRADA" && ["ERROR", "RECHAZADO"].includes(String(nota.estado_sunat ?? "PENDIENTE"))
}

function enviarLabel(nota: NotaCredito) {
  if (nota.estado === "BORRADOR") return "Registre la NC antes de enviar"
  if (nota.estado === "ANULADA") return "NC anulada"
  if (nota.estado_sunat === "ACEPTADO") return "Aceptada por SUNAT"
  return "Enviar SUNAT"
}

export function NotaCreditoSunatActions({ nota }: { nota: NotaCredito }) {
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const actions = useNotaCreditoSunatActions(nota)
  const canSeeEnviar = hasAnyPermission(["notas_credito.enviar_sunat"])
  const canSeeReenviar = hasAnyPermission(["notas_credito.reenviar_sunat"])
  const canSeeXml = hasAnyPermission(["notas_credito.descargar_xml", "notas_credito.xml.descargar"])
  const canSeeCdr = hasAnyPermission(["notas_credito.descargar_cdr", "notas_credito.cdr.descargar"])
  const enviarEnabled = canEnviar(nota)
  const reenviarEnabled = canReenviar(nota)

  return (
    <div className="flex flex-wrap gap-2">
      {canSeeEnviar ? (
        <GuiaConfirmAction
          title="Enviar nota de credito a SUNAT"
          description="Se enviara la Nota de Credito Electronica a SUNAT usando la configuracion activa de la empresa."
          actionLabel="Enviar"
          disabled={!enviarEnabled || actions.enviar.isPending}
          onConfirm={() => actions.enviar.mutate()}
        >
          <Button variant="outline" disabled={!enviarEnabled || actions.enviar.isPending}>
            <Send className="mr-2 h-4 w-4" />
            {actions.enviar.isPending ? "Enviando..." : enviarLabel(nota)}
          </Button>
        </GuiaConfirmAction>
      ) : null}

      {canSeeReenviar ? (
        <GuiaConfirmAction
          title="Reenviar nota de credito a SUNAT"
          description="La nota tiene estado SUNAT con error o rechazo. Confirma el reenvio solo si ya revisaste el mensaje de SUNAT."
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
        <Button variant="outline" disabled={!nota.tiene_xml || actions.descargarXml.isPending} onClick={() => actions.descargarXml.mutate()}>
          <Download className="mr-2 h-4 w-4" />
          {actions.descargarXml.isPending ? "Descargando..." : nota.tiene_xml ? "XML" : "XML no disponible"}
        </Button>
      ) : null}

      {canSeeCdr ? (
        <Button variant="outline" disabled={!nota.tiene_cdr || actions.descargarCdr.isPending} onClick={() => actions.descargarCdr.mutate()}>
          <Download className="mr-2 h-4 w-4" />
          {actions.descargarCdr.isPending ? "Descargando..." : nota.tiene_cdr ? "CDR" : "CDR no disponible"}
        </Button>
      ) : null}
    </div>
  )
}