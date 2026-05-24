import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, FilePlus2 } from "lucide-react"
import { ComprobanteDetailHeader } from "@/modules/comprobantes/components/ComprobanteDetailHeader"
import { ComprobanteDocumentActions } from "@/modules/comprobantes/components/ComprobanteDocumentActions"
import { useComprobante } from "@/modules/comprobantes/hooks/useComprobante"
import { getComprobanteDescuento, getComprobanteIgv, getComprobanteSubtotal, getComprobanteTotal } from "@/modules/comprobantes/types/comprobante.types"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { useAuthStore } from "@/shared/stores/auth.store"

export function ComprobanteDetailPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const { data: comprobante, isLoading } = useComprobante(id)

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (!comprobante) return <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">Comprobante no encontrado.</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link to="/comprobantes/boletas"><ArrowLeft className="mr-2 h-4 w-4" />Volver</Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          {hasAnyPermission(["notas_credito.crear", "sunat.notas.crear"]) && comprobante.estado_sunat === "ACEPTADO" && ["BOLETA", "FACTURA"].includes(String(comprobante.tipo_comprobante)) && comprobante.venta?.estado !== "ANULADA" ? (
            <Button variant="outline" onClick={() => navigate(`/comprobantes/notas-credito/nueva?comprobante_id=${comprobante.id}`)}>
              <FilePlus2 className="mr-2 h-4 w-4" />Generar Nota de Credito
            </Button>
          ) : null}
          {hasAnyPermission(["notas_debito.crear", "sunat.notas.crear"]) && comprobante.estado_sunat === "ACEPTADO" && ["BOLETA", "FACTURA"].includes(String(comprobante.tipo_comprobante)) && comprobante.venta?.estado !== "ANULADA" ? (
            <Button variant="outline" onClick={() => navigate(`/comprobantes/notas-debito/nueva?comprobante_id=${comprobante.id}`)}>
              <FilePlus2 className="mr-2 h-4 w-4" />Generar Nota de Debito
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
    </div>
  )
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="flex justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className={strong ? "text-right text-lg font-semibold" : "text-right font-medium"}>{value}</span></div>
}

