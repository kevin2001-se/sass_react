import { ArrowLeft, AlertCircle } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage } from "@/shared/services/api"

import { ResumenDiarioDetalleTable } from "../components/ResumenDiarioDetalleTable"
import { ResumenDiarioDocumentActions } from "../components/ResumenDiarioDocumentActions"
import { ResumenDiarioEstadoBadge } from "../components/ResumenDiarioEstadoBadge"
import { ResumenDiarioSunatBadge } from "../components/ResumenDiarioSunatBadge"
import { useResumenDiario } from "../hooks/useResumenDiario"
import { toNumber } from "../types/resumenDiario.types"

const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" })

function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value ?? "-"}</p>
    </div>
  )
}

export function ResumenDiarioDetailPage() {
  const { id } = useParams()
  const resumen = useResumenDiario(id)

  if (resumen.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (resumen.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No se pudo cargar el resumen diario</AlertTitle>
        <AlertDescription>{getLaravelErrorMessage(resumen.error, "Intenta nuevamente en unos segundos.")}</AlertDescription>
      </Alert>
    )
  }

  const data = resumen.data

  if (!data) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Resumen no encontrado</AlertTitle>
        <AlertDescription>No encontramos informacion para el resumen solicitado.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="w-fit px-0">
            <Link to="/comprobantes/resumen-diario"><ArrowLeft className="mr-2 h-4 w-4" />Volver al listado</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{data.identificador}</h1>
            <p className="text-sm text-muted-foreground">Resumen diario de boletas del {data.fecha_resumen}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ResumenDiarioEstadoBadge estado={data.estado} />
            <ResumenDiarioSunatBadge estado={data.estado_sunat} />
          </div>
        </div>
        <ResumenDiarioDocumentActions resumen={data} />
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
          <CardHeader><CardTitle>Datos del resumen</CardTitle></CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-3">
            <InfoItem label="Fecha resumen" value={data.fecha_resumen} />
            <InfoItem label="Correlativo" value={data.correlativo} />
            <InfoItem label="Ticket SUNAT" value={data.ticket_sunat ?? data.ticket} />
            <InfoItem label="Intentos envio" value={data.intentos_envio ?? 0} />
            <InfoItem label="Enviado at" value={data.enviado_at} />
            <InfoItem label="Consultado at" value={data.consultado_at} />
            <InfoItem label="Aceptado at" value={data.aceptado_at} />
            <InfoItem label="Rechazado at" value={data.rechazado_at} />
            <InfoItem label="PDF generado" value={data.pdf_generado_at} />
            <div className="md:col-span-3">
              <InfoItem label="Observacion" value={data.observacion} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Totales</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Documentos</span><span className="font-semibold">{toNumber(data.total_documentos)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Boletas</span><span>{toNumber(data.total_boletas)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Notas credito</span><span>{toNumber(data.total_notas_credito)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Notas debito</span><span>{toNumber(data.total_notas_debito)}</span></div>
            <Separator />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{currency.format(toNumber(data.monto_total))}</span></div>
          </CardContent>
        </Card>
      </div>

      <ResumenDiarioDetalleTable detalles={data.detalles ?? []} />
    </div>
  )
}