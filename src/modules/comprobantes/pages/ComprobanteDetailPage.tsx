import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Ban, FilePlus2 } from "lucide-react"
import { ComprobanteDetailHeader } from "@/modules/comprobantes/components/ComprobanteDetailHeader"
import { ComprobanteDocumentActions } from "@/modules/comprobantes/components/ComprobanteDocumentActions"
import { SolicitarBajaDialog } from "@/modules/comprobantes/components/SolicitarBajaDialog"
import { useComprobante } from "@/modules/comprobantes/hooks/useComprobante"
import { useComprobanteActions } from "@/modules/comprobantes/hooks/useComprobanteActions"
import { getComprobanteDescuento, getComprobanteIgv, getComprobanteSubtotal, getComprobanteTotal } from "@/modules/comprobantes/types/comprobante.types"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { formatCurrency, formatDateTime } from "@/modules/caja/components/cajaFormatters"
import { useAuthStore } from "@/shared/stores/auth.store"

export function ComprobanteDetailPage() {
  const id = Number(useParams().id)
  const [openBaja, setOpenBaja] = useState(false)
  const navigate = useNavigate()
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const { data: comprobante, isLoading } = useComprobante(id)
  const { solicitarBaja } = useComprobanteActions(id)

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (!comprobante) return <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">Comprobante no encontrado.</div>

  const canNotas = comprobante.estado_sunat === "ACEPTADO" && ["BOLETA", "FACTURA"].includes(String(comprobante.tipo_comprobante)) && comprobante.venta?.estado !== "ANULADA"
  const canSolicitarBaja =
    comprobante.estado_sunat === "ACEPTADO" &&
    (comprobante.estado_baja ?? "SIN_BAJA") === "SIN_BAJA" &&
    ["BOLETA", "FACTURA", "NOTA_CREDITO", "NOTA_DEBITO"].includes(String(comprobante.tipo_comprobante)) &&
    hasAnyPermission(["comprobantes.solicitar_baja"])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link to="/comprobantes/boletas"><ArrowLeft className="mr-2 h-4 w-4" />Volver</Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          {hasAnyPermission(["notas_credito.crear", "sunat.notas.crear"]) && canNotas ? (
            <Button variant="outline" onClick={() => navigate(`/comprobantes/notas-credito/nueva?comprobante_id=${comprobante.id}`)}>
              <FilePlus2 className="mr-2 h-4 w-4" />Generar Nota de Credito
            </Button>
          ) : null}
          {hasAnyPermission(["notas_debito.crear", "sunat.notas.crear"]) && canNotas ? (
            <Button variant="outline" onClick={() => navigate(`/comprobantes/notas-debito/nueva?comprobante_id=${comprobante.id}`)}>
              <FilePlus2 className="mr-2 h-4 w-4" />Generar Nota de Debito
            </Button>
          ) : null}
          {canSolicitarBaja ? (
            <Button variant="destructive" onClick={() => setOpenBaja(true)} disabled={solicitarBaja.isPending}>
              <Ban className="mr-2 h-4 w-4" />Dar de baja
            </Button>
          ) : null}
          <ComprobanteDocumentActions comprobante={comprobante} />
        </div>
      </div>

      <ComprobanteDetailHeader comprobante={comprobante} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader><CardTitle>Respuesta SUNAT</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Codigo" value={comprobante.codigo_respuesta ?? "-"} />
            <Row label="Mensaje" value={comprobante.mensaje_respuesta ?? "-"} />
            <Row label="Hash" value={comprobante.hash ?? "-"} />
            <Row label="Intentos" value={String(comprobante.intentos_envio ?? 0)} />
            <Separator />
            <p className="break-all text-muted-foreground">{comprobante.qr_text ?? "Sin QR registrado"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Totales</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Subtotal" value={formatCurrency(getComprobanteSubtotal(comprobante))} />
            <Row label="Descuento" value={formatCurrency(getComprobanteDescuento(comprobante))} />
            <Row label="IGV" value={formatCurrency(getComprobanteIgv(comprobante))} />
            <Separator />
            <Row label="Total" value={formatCurrency(getComprobanteTotal(comprobante))} strong />
          </CardContent>
        </Card>
      </div>

      {(comprobante.estado_baja && comprobante.estado_baja !== "SIN_BAJA") || comprobante.baja_historial?.length ? (
        <Card>
          <CardHeader><CardTitle>Baja interna</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <Row label="Estado" value={String(comprobante.estado_baja ?? "SIN_BAJA")} />
              <Row label="Fecha solicitud" value={comprobante.fecha_solicitud_baja ? formatDateTime(comprobante.fecha_solicitud_baja) : "-"} />
              <Row label="Usuario" value={comprobante.solicitado_baja_por?.name ?? "-"} />
            </div>
            <div>
              <p className="text-muted-foreground">Motivo</p>
              <p className="font-medium">{comprobante.motivo_baja ?? "-"}</p>
            </div>
            {comprobante.baja_historial?.length ? (
              <div className="space-y-2">
                <Separator />
                {comprobante.baja_historial.map((item) => (
                  <div key={item.id} className="rounded-md border p-3">
                    <p className="font-medium">{`${item.estado_anterior} -> ${item.estado_nuevo}`}</p>
                    <p className="text-muted-foreground">{item.motivo}</p>
                    <p className="text-xs text-muted-foreground">{item.usuario?.name ?? "Usuario"} | {item.created_at ? formatDateTime(item.created_at) : "-"}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <SolicitarBajaDialog
        open={openBaja}
        onOpenChange={setOpenBaja}
        isSubmitting={solicitarBaja.isPending}
        comprobanteNumero={comprobante.numero_comprobante}
        onConfirm={async (motivo_baja) => {
          await solicitarBaja.mutateAsync({ comprobanteId: comprobante.id, motivo_baja })
          setOpenBaja(false)
        }}
      />
    </div>
  )
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="flex justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className={strong ? "text-right text-lg font-semibold" : "text-right font-medium"}>{value}</span></div>
}

