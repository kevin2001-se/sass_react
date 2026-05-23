import { useState } from "react"

import { KardexTable } from "@/modules/inventario/components/KardexTable"
import { useKardex } from "@/modules/inventario/hooks/useKardex"
import { useProductos } from "@/modules/productos/hooks/useProductos"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

export function KardexPage() {
  const [productoId, setProductoId] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const productosQuery = useProductos({ per_page: 100, estado: "true" })
  const kardexQuery = useKardex(productoId ? Number(productoId) : undefined, { per_page: 100 })
  const movimientos = (kardexQuery.data?.data ?? []).filter((movimiento) => {
    const fecha = movimiento.created_at?.slice(0, 10)
    return (!fechaInicio || (fecha && fecha >= fechaInicio)) && (!fechaFin || (fecha && fecha <= fechaFin))
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Kardex</h1>
        <p className="text-sm text-muted-foreground">Historial de movimientos por producto y tienda activa.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Producto</Label>
            <AppCombobox
              value={productoId || null}
              onChange={(value) => setProductoId(value === null ? "" : String(value))}
              options={(productosQuery.data?.data ?? []).map((producto) => ({ value: producto.id, label: producto.nombre, description: producto.codigo_interno }))}
              placeholder="Seleccione producto"
              searchPlaceholder="Buscar producto..."
              emptyMessage="No se encontraron productos"
              loading={productosQuery.isLoading}
            />
          </div>
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

      {!productoId && (
        <Alert>
          <AlertTitle>Seleccione un producto</AlertTitle>
          <AlertDescription>El kardex se carga cuando elige un producto.</AlertDescription>
        </Alert>
      )}

      {kardexQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar el kardex</AlertTitle>
          <AlertDescription>Revise la API e intente nuevamente.</AlertDescription>
        </Alert>
      )}

      <KardexTable isLoading={kardexQuery.isLoading} movimientos={movimientos} />
    </div>
  )
}



