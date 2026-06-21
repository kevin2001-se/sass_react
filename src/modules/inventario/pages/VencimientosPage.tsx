import { useMemo, useState } from "react"

import { LotesTable } from "@/modules/inventario/components/LotesTable"
import { useParametro } from "@/modules/configuracion/parametros/hooks/useParametros"
import { useLotes } from "@/modules/inventario/hooks/useLotes"
import type { Lote } from "@/modules/inventario/types/inventario.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

function isVencido(lote: Lote) {
  if (!lote.fecha_vencimiento) return false
  return new Date(`${lote.fecha_vencimiento}T00:00:00`) < new Date()
}

function isPorVencer(lote: Lote, diasAlerta: number) {
  if (!lote.fecha_vencimiento || isVencido(lote)) return false
  const diff = new Date(`${lote.fecha_vencimiento}T00:00:00`).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) <= diasAlerta
}

export function VencimientosPage() {
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const diasAlerta = Number(useParametro<number>("dias_alerta_vencimiento", 30).value || 30)
  const lotesQuery = useLotes({ estado: "true", per_page: 100 })
  const lotes = lotesQuery.data?.data ?? []
  const filtered = useMemo(() => {
    return lotes.filter((lote) => {
      if (!lote.fecha_vencimiento) return false
      const fecha = lote.fecha_vencimiento
      return (!fechaInicio || fecha >= fechaInicio) && (!fechaFin || fecha <= fechaFin)
    })
  }, [lotes, fechaInicio, fechaFin])
  const vencidos = filtered.filter(isVencido)
  const porVencer = filtered.filter((lote) => isPorVencer(lote, diasAlerta))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Vencimientos</h1>
        <p className="text-sm text-muted-foreground">Controla lotes vencidos y proximos a vencer. Alertas configuradas a {diasAlerta} dias.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rango de fechas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Desde</Label>
            <Input type="date" value={fechaInicio} onChange={(event) => setFechaInicio(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Hasta</Label>
            <Input type="date" value={fechaFin} onChange={(event) => setFechaFin(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      {lotesQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudieron cargar los vencimientos</AlertTitle>
          <AlertDescription>Revise la API e intente nuevamente.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="por-vencer">
        <TabsList>
          <TabsTrigger value="por-vencer">Por vencer <Badge className="ml-2" variant="outline">{porVencer.length}</Badge></TabsTrigger>
          <TabsTrigger value="vencidos">Vencidos <Badge className="ml-2 bg-destructive text-destructive-foreground">{vencidos.length}</Badge></TabsTrigger>
        </TabsList>
        <TabsContent value="por-vencer">
          <LotesTable isLoading={lotesQuery.isLoading} lotes={porVencer} onDelete={() => undefined} onEdit={() => undefined} />
        </TabsContent>
        <TabsContent value="vencidos">
          <LotesTable isLoading={lotesQuery.isLoading} lotes={vencidos} onDelete={() => undefined} onEdit={() => undefined} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
