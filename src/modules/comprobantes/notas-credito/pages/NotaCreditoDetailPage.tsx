import { ArrowLeft, FileText } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { NotaCreditoActions } from "@/modules/comprobantes/notas-credito/components/NotaCreditoActions"
import { NotaCreditoDetalleTable } from "@/modules/comprobantes/notas-credito/components/NotaCreditoDetalleTable"
import { NotaCreditoDetailHeader } from "@/modules/comprobantes/notas-credito/components/NotaCreditoDetailHeader"
import { NotaCreditoDocumentActions } from "@/modules/comprobantes/notas-credito/components/NotaCreditoDocumentActions"
import { NotaCreditoResumenCard } from "@/modules/comprobantes/notas-credito/components/NotaCreditoResumenCard"
import { NotaCreditoSunatActions } from "@/modules/comprobantes/notas-credito/components/NotaCreditoSunatActions"
import { useNotaCredito } from "@/modules/comprobantes/notas-credito/hooks/useNotaCredito"
import { getNotaCreditoComprobanteRef, getNotaCreditoMotivo } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Skeleton } from "@/shared/components/ui/skeleton"

function formatDate(value?: string | null) { return value ? value.slice(0, 10) : "-" }

export function NotaCreditoDetailPage() {
  const { id } = useParams()
  const { data: nota, isLoading, isError, error } = useNotaCredito(id)
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-20 w-full" /><div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-48" /><Skeleton className="h-48" /></div><Skeleton className="h-64 w-full" /></div>
  if (isError || !nota) return <Alert variant="destructive"><FileText className="h-4 w-4" /><AlertTitle>No se pudo cargar la nota</AlertTitle><AlertDescription>{error instanceof Error ? error.message : "La nota solicitada no esta disponible."}</AlertDescription></Alert>

  return (
    <div className="space-y-6">
      <NotaCreditoDetailHeader nota={nota} />
      <Card><CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle className="text-base">Acciones</CardTitle><NotaCreditoActions nota={nota} /></CardHeader><CardContent className="space-y-4"><NotaCreditoSunatActions nota={nota} /><NotaCreditoDocumentActions nota={nota} /><div className="flex flex-wrap gap-2"><Button variant="outline" asChild><Link to="/comprobantes/notas-credito"><ArrowLeft className="mr-2 h-4 w-4" />Volver al listado</Link></Button>{nota.comprobante_id ? <Button variant="outline" asChild><Link to={`/comprobantes/${nota.comprobante_id}`}>Volver a comprobante original</Link></Button> : null}{nota.venta_id ? <Button variant="outline" asChild><Link to={`/ventas/${nota.venta_id}`}>Volver a venta original</Link></Button> : null}</div>{nota.codigo_respuesta || nota.mensaje_respuesta ? <Alert><FileText className="h-4 w-4" /><AlertTitle>Respuesta SUNAT {nota.codigo_respuesta ? `(${nota.codigo_respuesta})` : ""}</AlertTitle><AlertDescription>{nota.mensaje_respuesta || "Sin mensaje de respuesta."}</AlertDescription></Alert> : null}</CardContent></Card>
      <div className="grid gap-4 lg:grid-cols-3"><Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Datos principales</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><Info label="Fecha" value={formatDate(nota.created_at)} /><Info label="Motivo" value={getNotaCreditoMotivo(nota)} /><Info label="Tipo nota" value={nota.tipo_nota} /><Info label="Comprobante relacionado" value={getNotaCreditoComprobanteRef(nota)} /><Info label="Venta relacionada" value={nota.venta?.numero_comprobante || (nota.venta_id ? `Venta #${nota.venta_id}` : "-")} /><Info label="Cliente" value={nota.cliente?.nombre || nota.venta?.cliente?.razon_social || nota.venta?.cliente?.nombres || "CLIENTES VARIOS"} /><Info label="Observacion" value={nota.observacion || "-"} /></CardContent></Card><NotaCreditoResumenCard nota={nota} /></div>
      <Card><CardHeader><CardTitle className="text-base">Efectos internos</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2"><EffectBadge label="Afecta stock" active={nota.afecta_stock} /><EffectBadge label="Stock aplicado" active={nota.stock_aplicado} /><EffectBadge label="Afecta caja" active={nota.afecta_caja} /><EffectBadge label="Caja aplicada" active={nota.caja_aplicada} /></div>{nota.mensaje_efectos ? <p className="mt-3 text-sm text-muted-foreground">{nota.mensaje_efectos}</p> : null}<Separator className="my-4" /><p className="text-xs text-muted-foreground">La venta original se conserva como historial; los efectos se registran mediante movimientos internos.</p></CardContent></Card>
      <NotaCreditoDetalleTable detalles={nota.detalles ?? []} />
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string | number | null }) { return <div><p className="text-xs font-medium uppercase text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value || "-"}</p></div> }
function EffectBadge({ label, active }: { label: string; active?: boolean }) { return <Badge variant="outline" className={active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "text-muted-foreground"}>{label}: {active ? "Si" : "No"}</Badge> }

