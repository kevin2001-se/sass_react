import { useState } from "react"

import { AperturarCajaModal } from "@/modules/caja/components/AperturarCajaModal"
import { ArqueoCajaCard } from "@/modules/caja/components/ArqueoCajaCard"
import { CajaMovimientosTable } from "@/modules/caja/components/CajaMovimientosTable"
import { CajaResumenCard } from "@/modules/caja/components/CajaResumenCard"
import { CerrarCajaModal } from "@/modules/caja/components/CerrarCajaModal"
import { RegistrarEgresoModal } from "@/modules/caja/components/RegistrarEgresoModal"
import { RegistrarIngresoModal } from "@/modules/caja/components/RegistrarIngresoModal"
import { useArqueoCaja, useCajaAbierta, useCajaMovimientos } from "@/modules/caja/hooks/useCaja"
import type { ArqueoCaja } from "@/modules/caja/types/caja.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useAuthStore } from "@/shared/stores/auth.store"

export function CajaPage() {
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const [aperturaOpen, setAperturaOpen] = useState(false)
  const [ingresoOpen, setIngresoOpen] = useState(false)
  const [egresoOpen, setEgresoOpen] = useState(false)
  const [cierreOpen, setCierreOpen] = useState(false)
  const [arqueoCierre, setArqueoCierre] = useState<ArqueoCaja | null>(null)
  const cajaQuery = useCajaAbierta()
  const caja = cajaQuery.data
  const arqueoQuery = useArqueoCaja(caja?.id)
  const movimientosQuery = useCajaMovimientos({ caja_id: caja?.id, per_page: 100 })

  if (cajaQuery.isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!caja) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Caja actual</h1>
          <p className="text-sm text-muted-foreground">Control de caja por tienda activa.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No hay caja abierta</CardTitle>
            <CardDescription>Debe aperturar caja antes de registrar ingresos, egresos o ventas contado.</CardDescription>
          </CardHeader>
          <CardContent>
            {hasPermission("caja.aperturar") && <Button onClick={() => setAperturaOpen(true)}>Aperturar caja</Button>}
          </CardContent>
        </Card>
        <AperturarCajaModal open={aperturaOpen} onOpenChange={setAperturaOpen} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Caja actual</h1>
          <p className="text-sm text-muted-foreground">Caja abierta de la tienda activa.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasPermission("caja.ingreso") && <Button variant="outline" onClick={() => setIngresoOpen(true)}>Registrar ingreso</Button>}
          {hasPermission("caja.egreso") && <Button variant="outline" onClick={() => setEgresoOpen(true)}>Registrar egreso</Button>}
          {hasPermission("caja.cerrar") && <Button onClick={() => setCierreOpen(true)}>Cerrar caja</Button>}
        </div>
      </div>

      {cajaQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar caja</AlertTitle>
          <AlertDescription>Revise la conexión con la API.</AlertDescription>
        </Alert>
      )}

      <CajaResumenCard arqueo={arqueoQuery.data} caja={caja} />

      <Tabs defaultValue="movimientos">
        <TabsList>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="arqueo">Arqueo</TabsTrigger>
        </TabsList>
        <TabsContent value="movimientos">
          <CajaMovimientosTable isLoading={movimientosQuery.isLoading} movimientos={movimientosQuery.data?.data ?? caja.movimientos ?? []} />
        </TabsContent>
        <TabsContent value="arqueo">
          {arqueoQuery.data ? <ArqueoCajaCard arqueo={arqueoQuery.data} /> : <Skeleton className="h-64 w-full" />}
        </TabsContent>
      </Tabs>

      {arqueoCierre && (
        <Alert>
          <AlertTitle>Caja cerrada</AlertTitle>
          <AlertDescription>El arqueo final fue generado correctamente.</AlertDescription>
        </Alert>
      )}

      <RegistrarIngresoModal open={ingresoOpen} onOpenChange={setIngresoOpen} />
      <RegistrarEgresoModal open={egresoOpen} onOpenChange={setEgresoOpen} />
      {arqueoQuery.data && (
        <CerrarCajaModal caja={caja} arqueo={arqueoQuery.data} open={cierreOpen} onClosed={setArqueoCierre} onOpenChange={setCierreOpen} />
      )}
    </div>
  )
}
