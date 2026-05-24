import { ArrowLeft, FileText } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { NotaDebitoActions } from "@/modules/comprobantes/notas-debito/components/NotaDebitoActions"
import { NotaDebitoDetalleTable } from "@/modules/comprobantes/notas-debito/components/NotaDebitoDetalleTable"
import { NotaDebitoDocumentActions } from "@/modules/comprobantes/notas-debito/components/NotaDebitoDocumentActions"
import { NotaDebitoDetailHeader } from "@/modules/comprobantes/notas-debito/components/NotaDebitoDetailHeader"
import { NotaDebitoResumenCard } from "@/modules/comprobantes/notas-debito/components/NotaDebitoResumenCard"
import { NotaDebitoSunatActions } from "@/modules/comprobantes/notas-debito/components/NotaDebitoSunatActions"
import { useNotaDebito } from "@/modules/comprobantes/notas-debito/hooks/useNotaDebito"
import { getNotaDebitoComprobanteRef, getNotaDebitoMotivo } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Skeleton } from "@/shared/components/ui/skeleton"

function formatDate(value?: string | null) { return value ? value.slice(0, 10) : "-" }

export function NotaDebitoDetailPage() {
  const { id } = useParams()
  const { data: nota, isLoading, isError, error } = useNotaDebito(id)
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-20 w-full" /><div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-48" /><Skeleton className="h-48" /></div><Skeleton className="h-64 w-full" /></div>
  if (isError || !nota) return <Alert variant="destructive"><FileText className="h-4 w-4" /><AlertTitle>No se pudo cargar la nota</AlertTitle><AlertDescription>{error instanceof Error ? error.message : "La nota solicitada no esta disponible."}</AlertDescription></Alert>

  return (
    <div className="space-y-6">
      <NotaDebitoDetailHeader nota={nota} />
      <Card><CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle className="text-base">Acciones</CardTitle><NotaDebitoActions nota={nota} /></CardHeader><CardContent className="space-y-4"><NotaDebitoSunatActions nota={nota} /><NotaDebitoDocumentActions nota={nota} /><div className="flex flex-wrap gap-2"><Button variant="outline" asChild><Link to="/comprobantes/notas-debito"><ArrowLeft className="mr-2 h-4 w-4" />Volver al listado</Link></Button>{nota.comprobante_id ? <Button variant="outline" asChild><Link to={`/comprobantes/${nota.comprobante_id}`}>Volver a comprobante original</Link></Button> : null}{nota.venta_id ? <Button variant="outline" asChild><Link to={`/ventas/${nota.venta_id}`}>Volver a venta original</Link></Button> : null}</div>{nota.codigo_respuesta || nota.mensaje_respuesta ? <Alert><FileText className="h-4 w-4" /><AlertTitle>Respuesta SUNAT {nota.codigo_respuesta ? `(${nota.codigo_respuesta})` : ""}</AlertTitle><AlertDescription>{nota.mensaje_respuesta || "Sin mensaje de respuesta."}</AlertDescription></Alert> : null}</CardContent></Card>
      <div className="grid gap-4 lg:grid-cols-3"><Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Datos principales</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><Info label="Fecha" value={formatDate(nota.created_at)} /><Info label="Motivo" value={getNotaDebitoMotivo(nota)} /><Info label="Comprobante relacionado" value={getNotaDebitoComprobanteRef(nota)} /><Info label="Venta relacionada" value={nota.venta?.numero_comprobante || (nota.venta_id ? `Venta #${nota.venta_id}` : "-")} /><Info label="Cliente" value={nota.cliente?.nombre || nota.venta?.cliente?.razon_social || nota.venta?.cliente?.nombres || "CLIENTES VARIOS"} /><Info label="Observacion" value={nota.observacion || "-"} /></CardContent></Card><NotaDebitoResumenCard nota={nota} /></div>
      <Card><CardHeader><CardTitle className="text-base">Caja</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2"><EffectBadge label="Afecta caja" active={nota.afecta_caja} /><EffectBadge label="Caja aplicada" active={nota.caja_aplicada} /></div><Separator className="my-4" /><p className="text-xs text-muted-foreground">La venta original se conserva como historial; cualquier cobro adicional se refleja en movimientos de caja.</p></CardContent></Card>
      <NotaDebitoDetalleTable detalles={nota.detalles ?? []} />
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string | number | null }) { return <div><p className="text-xs font-medium uppercase text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value || "-"}</p></div> }
function EffectBadge({ label, active }: { label: string; active?: boolean }) { return <Badge variant="outline" className={active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "text-muted-foreground"}>{label}: {active ? "Si" : "No"}</Badge> }