import { ArrowLeft, XCircle } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { PagoProveedorAnularDialog } from "@/modules/compras/pagos-proveedor/components/PagoProveedorAnularDialog"
import { PagoProveedorEstadoBadge } from "@/modules/compras/pagos-proveedor/components/PagoProveedorEstadoBadge"
import { usePagoProveedor } from "@/modules/compras/pagos-proveedor/hooks/usePagoProveedor"
import { usePagoProveedorMutations } from "@/modules/compras/pagos-proveedor/hooks/usePagoProveedorMutations"
import type { AnularPagoProveedorPayload } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"
import { getLaravelErrorMessage } from "@/shared/services/api"

function money(value?: number | string | null) { return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(value ?? 0)) }
function Field({ label, value }: { label: string; value?: string | number | null }) { return <div><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value || "-"}</p></div> }

export function PagoProveedorDetailPage() {
  const id = Number(useParams().id)
  const query = usePagoProveedor(id)
  const mutations = usePagoProveedorMutations()
  const [anularOpen, setAnularOpen] = useState(false)

  async function anular(values: AnularPagoProveedorPayload) {
    if (!query.data) return
    try {
      await mutations.anular.mutateAsync({ id: query.data.id, values })
      toast.success("Pago anulado correctamente")
      setAnularOpen(false)
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo anular el pago."))
    }
  }

  if (query.isLoading) return <Skeleton className="h-96 w-full" />
  if (query.isError) return <Alert variant="destructive"><AlertTitle>No se pudo cargar el pago</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert>
  if (!query.data) return <Alert><AlertTitle>Pago no encontrado</AlertTitle><AlertDescription>No se encontro el pago solicitado.</AlertDescription></Alert>
  const pago = query.data

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><Button variant="ghost" size="sm" asChild className="mb-2 -ml-2"><Link to="/compras/pagos-proveedor"><ArrowLeft className="mr-2 h-4 w-4" />Volver</Link></Button><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight">Pago proveedor #{pago.id}</h1><PagoProveedorEstadoBadge estado={pago.estado} /></div></div>
        {pago.estado === "REGISTRADO" ? <Button variant="destructive" onClick={() => setAnularOpen(true)}><XCircle className="mr-2 h-4 w-4" />Anular pago</Button> : null}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Datos del pago</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Field label="Fecha" value={pago.fecha_pago} /><Field label="Metodo" value={pago.metodo_pago} /><Field label="Monto" value={money(pago.monto)} /><Field label="Referencia" value={pago.referencia} /><Field label="Caja" value={pago.caja_id ? `Caja #${pago.caja_id}` : "-"} /><Field label="Usuario" value={pago.creado_por?.name} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Proveedor y cuenta</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Field label="Proveedor" value={pago.proveedor?.razon_social} /><Field label="Cuenta" value={`CxP #${pago.cuenta_por_pagar_id}`} /><Field label="Compra" value={pago.cuenta_por_pagar?.compra?.numero_documento} /><Field label="Saldo actual" value={money(pago.cuenta_por_pagar?.saldo_pendiente ?? pago.cuenta_por_pagar?.saldo)} /></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Observacion</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{pago.observacion || "Sin observacion."}</p></CardContent></Card>
      <PagoProveedorAnularDialog open={anularOpen} pago={pago} loading={mutations.anular.isPending} onOpenChange={setAnularOpen} onConfirm={anular} />
    </div>
  )
}