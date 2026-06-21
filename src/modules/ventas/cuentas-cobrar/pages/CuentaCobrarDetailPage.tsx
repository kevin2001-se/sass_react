import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { CuentaCobrarEstadoBadge } from "../components/CuentaCobrarEstadoBadge"
import { CuentaCobrarResumenCard } from "../components/CuentaCobrarResumenCard"
import { PagosClienteTable } from "../components/PagosClienteTable"
import { RegistrarPagoClienteModal } from "../components/RegistrarPagoClienteModal"
import { useCuentaCobrar } from "../hooks/useCuentaCobrar"
import { clienteNombre, getSaldoCuenta } from "../types/cuentaCobrar.types"
export function CuentaCobrarDetailPage() {
  const { id } = useParams()
  const query = useCuentaCobrar(id)
  const [payOpen, setPayOpen] = useState(false)
  if (query.isLoading) return <Skeleton className="h-96 w-full" />
  if (query.isError) return <Alert variant="destructive"><AlertTitle>No se pudo cargar la cuenta</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert>
  const cuenta = query.data
  if (!cuenta) return null
  return <div className="space-y-6"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><Button variant="ghost" asChild className="mb-2 px-0"><Link to="/ventas/cuentas-por-cobrar"><ArrowLeft className="h-4 w-4" /> Volver</Link></Button><h1 className="text-2xl font-semibold tracking-tight">Cuenta por cobrar #{cuenta.id}</h1><p className="text-sm text-muted-foreground">{clienteNombre(cuenta.cliente)} - {cuenta.venta?.numero_comprobante ?? `Venta #${cuenta.venta_id}`}</p></div><div className="flex items-center gap-2"><CuentaCobrarEstadoBadge estado={cuenta.estado} /><Button disabled={getSaldoCuenta(cuenta) <= 0} onClick={() => setPayOpen(true)}>Registrar pago</Button></div></div><CuentaCobrarResumenCard cuenta={cuenta} /><Card><CardHeader><CardTitle>Datos</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2"><div><p className="text-sm text-muted-foreground">Cliente</p><p className="font-medium">{clienteNombre(cuenta.cliente)}</p></div><div><p className="text-sm text-muted-foreground">Documento</p><p className="font-medium">{cuenta.cliente?.tipo_documento} {cuenta.cliente?.numero_documento}</p></div><div><p className="text-sm text-muted-foreground">Venta</p><p className="font-medium">{cuenta.venta?.tipo_comprobante} {cuenta.venta?.numero_comprobante}</p></div><div><p className="text-sm text-muted-foreground">Fechas</p><p className="font-medium">{cuenta.fecha_emision ?? "-"} / {cuenta.fecha_vencimiento ?? "Sin vencimiento"}</p></div></CardContent></Card><Card><CardHeader><CardTitle>Pagos realizados</CardTitle></CardHeader><CardContent>{cuenta.pagos?.length ? <PagosClienteTable pagos={cuenta.pagos} /> : <p className="text-sm text-muted-foreground">Aun no hay pagos registrados.</p>}</CardContent></Card><RegistrarPagoClienteModal cuenta={cuenta} open={payOpen} onOpenChange={setPayOpen} /></div>
}
