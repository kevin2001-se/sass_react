import { Link, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft } from "lucide-react"

import { VentaDetailHeader } from "@/modules/ventas/components/VentaDetailHeader"
import { VentaItemsTable } from "@/modules/ventas/components/VentaItemsTable"
import { VentaPagosCard } from "@/modules/ventas/components/VentaPagosCard"
import { VentaQuickActions } from "@/modules/ventas/components/VentaQuickActions"
import { VentaResumenCard } from "@/modules/ventas/components/VentaResumenCard"
import { useVenta } from "@/modules/ventas/hooks/useVenta"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function VentaDetailPage() {
  const params = useParams()
  const ventaId = Number(params.id)
  const { data: venta, isLoading, isError, refetch } = useVenta(ventaId)

  if (isLoading) return <DetailSkeleton />

  if (isError || !venta) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No se pudo cargar la venta</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-3">
          <span>La venta no existe o no pertenece a la tienda activa.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Reintentar</Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link to="/ventas/historial"><ArrowLeft className="mr-2 h-4 w-4" />Volver</Link>
        </Button>
        <VentaQuickActions venta={venta} />
      </div>

      <VentaDetailHeader venta={venta} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <VentaItemsTable detalles={venta.detalles} />
          <Card>
            <CardHeader>
              <CardTitle>Informacion SUNAT</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3 text-sm">
              {venta.comprobante_electronico ? (
                <>
                  <Badge variant="secondary">{venta.comprobante_electronico.estado_sunat}</Badge>
                  <span className="text-muted-foreground">Comprobante electronico #{venta.comprobante_electronico.id}</span>
                </>
              ) : (
                <span className="text-muted-foreground">No aplica o aun no tiene comprobante electronico.</span>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <VentaResumenCard venta={venta} />
          <VentaPagosCard pagos={venta.pagos} />
          {venta.observacion ? (
            <Card>
              <CardHeader><CardTitle>Observacion</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">{venta.observacion}</CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-32 w-full" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}