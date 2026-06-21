import { ArrowLeft, CreditCard, ExternalLink } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { CuentaPagarEstadoBadge } from "@/modules/compras/cuentas-pagar/components/CuentaPagarEstadoBadge"
import { CuentaPagarResumenCard } from "@/modules/compras/cuentas-pagar/components/CuentaPagarResumenCard"
import { useCuentaPagar } from "@/modules/compras/cuentas-pagar/hooks/useCuentaPagar"
import { getLaravelErrorMessage } from "@/shared/services/api"

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return <div><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value || "-"}</p></div>
}

export function CuentaPagarDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const query = useCuentaPagar(id)

  if (query.isLoading) return <Skeleton className="h-96 w-full" />
  if (query.isError) return <Alert variant="destructive"><AlertTitle>No se pudo cargar la cuenta</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert>
  if (!query.data) return <Alert><AlertTitle>Cuenta no encontrada</AlertTitle><AlertDescription>No se encontro la cuenta por pagar solicitada.</AlertDescription></Alert>

  const cuenta = query.data

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2"><Link to="/compras/cuentas-por-pagar"><ArrowLeft className="mr-2 h-4 w-4" />Volver</Link></Button>
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight">Cuenta por pagar #{cuenta.id}</h1><CuentaPagarEstadoBadge estado={cuenta.estado} /></div>
          <p className="text-sm text-muted-foreground">Generada desde compra {cuenta.compra?.numero_documento ?? `#${cuenta.compra_id}`}</p>
        </div>
        <div className="flex flex-wrap gap-2">{Number(cuenta.saldo_pendiente ?? cuenta.saldo) > 0 && !["ANULADO", "ANULADA", "PAGADO", "PAGADA"].includes(cuenta.estado) ? <Button asChild><Link to={`/compras/cuentas-por-pagar/${cuenta.id}/pagar`}><CreditCard className="mr-2 h-4 w-4" />Registrar pago</Link></Button> : null}{cuenta.compra_id ? <Button variant="outline" asChild><Link to={`/compras/${cuenta.compra_id}`}><ExternalLink className="mr-2 h-4 w-4" />Ver compra</Link></Button> : null}</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Proveedor y compra</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="Proveedor" value={cuenta.proveedor?.razon_social} />
              <Field label="Documento proveedor" value={cuenta.proveedor?.numero_documento} />
              <Field label="Compra" value={cuenta.compra?.numero_documento ?? cuenta.compra_id} />
              <Field label="Tipo de pago" value={cuenta.compra?.tipo_pago} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Fechas y estado</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Field label="Fecha emision" value={cuenta.fecha_emision} />
              <Field label="Fecha vencimiento" value={cuenta.fecha_vencimiento} />
              <Field label="Estado registrado" value={cuenta.estado_registrado ?? cuenta.estado} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Observacion</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{cuenta.observacion || "Sin observacion."}</p></CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <CuentaPagarResumenCard cuenta={cuenta} />
          <Card>
            <CardContent className="space-y-3 pt-6 text-sm text-muted-foreground">
              <p>Los pagos a proveedor se habilitaran en la siguiente fase.</p>
              <Separator />
              <p>Esta pantalla es solo consulta y seguimiento de saldos.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}