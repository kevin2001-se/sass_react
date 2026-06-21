import { AlertCircle, ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage } from "@/shared/services/api"

import { ComunicacionBajaDetalleTable } from "../components/ComunicacionBajaDetalleTable"
import { ComunicacionBajaDocumentActions } from "../components/ComunicacionBajaDocumentActions"
import { ComunicacionBajaEstadoBadge } from "../components/ComunicacionBajaEstadoBadge"
import { ComunicacionBajaSunatBadge } from "../components/ComunicacionBajaSunatBadge"
import { useComunicacionBaja } from "../hooks/useComunicacionBaja"
import { toNumber } from "../types/comunicacionBaja.types"

function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value ?? "-"}</p>
    </div>
  )
}

export function ComunicacionBajaDetailPage() {
  const { id } = useParams()
  const comunicacion = useComunicacionBaja(id)

  if (comunicacion.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (comunicacion.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No se pudo cargar la comunicacion de baja</AlertTitle>
        <AlertDescription>{getLaravelErrorMessage(comunicacion.error, "Intenta nuevamente en unos segundos.")}</AlertDescription>
      </Alert>
    )
  }

  const data = comunicacion.data

  if (!data) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Comunicacion no encontrada</AlertTitle>
        <AlertDescription>No encontramos informacion para la comunicacion solicitada.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="w-fit px-0">
            <Link to="/comprobantes/comunicacion-baja"><ArrowLeft className="mr-2 h-4 w-4" />Volver al listado</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{data.identificador}</h1>
            <p className="text-sm text-muted-foreground">Comunicacion de baja del {data.fecha_baja}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ComunicacionBajaEstadoBadge estado={data.estado} />
            <ComunicacionBajaSunatBadge estado={data.estado_sunat} />
          </div>
        </div>
        <ComunicacionBajaDocumentActions comunicacion={data} />
      </div>

      {data.mensaje_respuesta ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mensaje SUNAT</AlertTitle>
          <AlertDescription>{data.codigo_respuesta ? `${data.codigo_respuesta}: ` : ""}{data.mensaje_respuesta}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Datos de la comunicacion</CardTitle></CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-3">
            <InfoItem label="Fecha baja" value={data.fecha_baja} />
            <InfoItem label="Correlativo" value={data.correlativo} />
            <InfoItem label="Ticket SUNAT" value={data.ticket_sunat} />
            <InfoItem label="Intentos envio" value={data.intentos_envio ?? 0} />
            <InfoItem label="Enviado at" value={data.enviado_at} />
            <InfoItem label="Consultado at" value={data.consultado_at} />
            <InfoItem label="Aceptado at" value={data.aceptado_at} />
            <InfoItem label="Rechazado at" value={data.rechazado_at} />
            <InfoItem label="PDF generado" value={data.pdf_generado_at} />
            <div className="md:col-span-3"><InfoItem label="Observacion" value={data.observacion} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Documentos</span><span className="font-semibold">{toNumber(data.total_documentos)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">XML</span><span>{data.tiene_xml ? "Disponible" : "Pendiente"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">CDR</span><span>{data.tiene_cdr ? "Disponible" : "Pendiente"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">PDF</span><span>{data.tiene_pdf_a4 ? "Disponible" : "Pendiente"}</span></div>
            <Separator />
            <InfoItem label="Creado por" value={data.creado_por?.name} />
          </CardContent>
        </Card>
      </div>

      <ComunicacionBajaDetalleTable detalles={data.detalles ?? []} />
    </div>
  )
}
