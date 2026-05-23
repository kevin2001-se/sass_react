import { FileText } from "lucide-react"
import { useParams } from "react-router-dom"

import { GuiaRemisionActions } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionActions"
import { GuiaRemisionSunatActions } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionSunatActions"
import { GuiaRemisionDocumentActions } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionDocumentActions"
import { GuiaRemisionDetalleTable } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionDetalleTable"
import { GuiaRemisionDetailHeader } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionDetailHeader"
import { GuiaRemisionInfoCard } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionInfoCard"
import { useGuiaRemision } from "@/modules/comprobantes/guias-remision/hooks/useGuiaRemision"
import { getGuiaModalidad, getGuiaMotivo } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Skeleton } from "@/shared/components/ui/skeleton"

function formatDate(value?: string | null) {
  return value ? value.slice(0, 10) : "-"
}

export function GuiaRemisionDetailPage() {
  const { id } = useParams()
  const { data: guia, isLoading, isError, error } = useGuiaRemision(id)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-48" /><Skeleton className="h-48" /></div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !guia) {
    return (
      <Alert variant="destructive">
        <FileText className="h-4 w-4" />
        <AlertTitle>No se pudo cargar la guia</AlertTitle>
        <AlertDescription>{error instanceof Error ? error.message : "La guia solicitada no esta disponible."}</AlertDescription>
      </Alert>
    )
  }

  const isPublico = guia.modalidad_transporte === "01"

  return (
    <div className="space-y-6">
      <GuiaRemisionDetailHeader guia={guia} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Acciones</CardTitle>
          <GuiaRemisionActions guia={guia} />
        </CardHeader>
        <CardContent className="space-y-4">
          <GuiaRemisionSunatActions guia={guia} />
          <GuiaRemisionDocumentActions guia={guia} />
          {guia.codigo_respuesta || guia.mensaje_respuesta ? (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Respuesta SUNAT {guia.codigo_respuesta ? `(${guia.codigo_respuesta})` : ""}</AlertTitle>
              <AlertDescription>{guia.mensaje_respuesta || "Sin mensaje de respuesta."}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <GuiaRemisionInfoCard
          title="Datos principales"
          items={[
            { label: "Fecha emision", value: formatDate(guia.fecha_emision) },
            { label: "Fecha traslado", value: formatDate(guia.fecha_traslado) },
            { label: "Motivo", value: getGuiaMotivo(guia) },
            { label: "Modalidad", value: getGuiaModalidad(guia) },
            { label: "Peso total", value: `${guia.peso_total ?? "-"} ${guia.unidad_peso ?? ""}`.trim() },
            { label: "Bultos", value: guia.numero_bultos ?? "-" },
            { label: "Observacion", value: guia.observacion ?? "-" },
          ]}
        />

        <GuiaRemisionInfoCard
          title="Destinatario"
          items={[
            { label: "Tipo documento", value: guia.destinatario_tipo_documento },
            { label: "Numero documento", value: guia.destinatario_numero_documento },
            { label: "Nombre", value: guia.destinatario_nombre },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GuiaRemisionInfoCard
          title="Punto de partida"
          items={[
            { label: "Ubigeo", value: guia.punto_partida_ubigeo },
            { label: "Direccion", value: guia.punto_partida_direccion },
          ]}
        />
        <GuiaRemisionInfoCard
          title="Punto de llegada"
          items={[
            { label: "Ubigeo", value: guia.punto_llegada_ubigeo },
            { label: "Direccion", value: guia.punto_llegada_direccion },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transporte</CardTitle>
        </CardHeader>
        <CardContent>
          {isPublico ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="RUC transportista" value={guia.transportista_ruc} />
              <Info label="Razon social" value={guia.transportista_razon_social} />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Conductor" value={guia.conductor_nombre} />
              <Info label="Documento" value={`${guia.conductor_tipo_documento ?? ""} ${guia.conductor_numero_documento ?? ""}`.trim()} />
              <Info label="Licencia" value={guia.conductor_licencia} />
              <Info label="Placa" value={guia.vehiculo_placa} />
            </div>
          )}
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">Los documentos se generan y descargan desde endpoints protegidos, sin exponer storage privado.</p>
        </CardContent>
      </Card>

      <GuiaRemisionDetalleTable detalles={guia.detalles ?? []} />
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value || "-"}</p>
    </div>
  )
}
