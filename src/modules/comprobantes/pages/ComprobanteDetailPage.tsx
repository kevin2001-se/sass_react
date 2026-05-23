import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { ComprobanteDetailHeader } from "@/modules/comprobantes/components/ComprobanteDetailHeader"
import { ComprobanteDocumentActions } from "@/modules/comprobantes/components/ComprobanteDocumentActions"
import { useComprobante } from "@/modules/comprobantes/hooks/useComprobante"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function ComprobanteDetailPage() {
  const id = Number(useParams().id)
  const { data: comprobante, isLoading } = useComprobante(id)
  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (!comprobante) return <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">Comprobante no encontrado.</div>
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><Button variant="outline" asChild><Link to="/comprobantes/boletas"><ArrowLeft className="mr-2 h-4 w-4" />Volver</Link></Button><ComprobanteDocumentActions comprobante={comprobante} /></div><ComprobanteDetailHeader comprobante={comprobante} /><Card><CardHeader><CardTitle>Respuesta SUNAT</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><Row label="Codigo" value={comprobante.codigo_respuesta ?? "-"} /><Row label="Mensaje" value={comprobante.mensaje_respuesta ?? "-"} /><Row label="Hash" value={comprobante.hash ?? "-"} /><Row label="Intentos" value={String(comprobante.intentos_envio ?? 0)} /><Separator /><p className="break-all text-muted-foreground">{comprobante.qr_text ?? "Sin QR registrado"}</p></CardContent></Card></div>
}
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium">{value}</span></div> }