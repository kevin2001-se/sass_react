import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useCuentaPagar } from "@/modules/compras/cuentas-pagar/hooks/useCuentaPagar"
import { PagoProveedorFormModal } from "@/modules/compras/pagos-proveedor/components/PagoProveedorFormModal"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function PagoProveedorCreatePage() {
  const cuentaId = Number(useParams().id)
  const navigate = useNavigate()
  const query = useCuentaPagar(cuentaId)
  const [open, setOpen] = useState(true)

  if (query.isLoading) return <Skeleton className="h-64 w-full" />
  if (query.isError) return <Alert variant="destructive"><AlertTitle>No se pudo cargar la cuenta</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert>

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2"><Link to={`/compras/cuentas-por-pagar/${cuentaId}`}><ArrowLeft className="mr-2 h-4 w-4" />Volver a cuenta</Link></Button>
      <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Se abrira el formulario para registrar el pago de la cuenta seleccionada.</p><Button className="mt-4" onClick={() => setOpen(true)}>Abrir formulario</Button></CardContent></Card>
      <PagoProveedorFormModal open={open} onOpenChange={(value) => { setOpen(value); if (!value) navigate(`/compras/cuentas-por-pagar/${cuentaId}`) }} cuentaInicial={query.data} onCreated={(pago) => navigate(`/compras/pagos-proveedor/${pago.id}`)} />
    </div>
  )
}