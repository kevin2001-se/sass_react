import { useMemo, useState } from "react"

import { InventarioFilters } from "@/modules/inventario/components/InventarioFilters"
import { StockTable } from "@/modules/inventario/components/StockTable"
import { useStock } from "@/modules/inventario/hooks/useStock"
import { useProductoCatalogos } from "@/modules/productos/hooks/useProductoCatalogos"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"

export function StockPage() {
  const [buscar, setBuscar] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [bajoStock, setBajoStock] = useState("")
  const stockQuery = useStock({ bajo_stock: bajoStock, per_page: 100 })
  const catalogosQuery = useProductoCatalogos()
  const stocks = stockQuery.data?.data ?? []

  const filteredStocks = useMemo(() => {
    const term = buscar.trim().toLowerCase()
    return stocks.filter((stock) => {
      const producto = stock.producto
      const matchBuscar = !term || producto?.nombre?.toLowerCase().includes(term) || producto?.codigo_interno?.toLowerCase().includes(term)
      const matchCategoria = !categoriaId || String(producto?.categoria_id) === categoriaId
      return matchBuscar && matchCategoria
    })
  }, [stocks, buscar, categoriaId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Stock actual</h1>
        <p className="text-sm text-muted-foreground">Consulta el stock real en unidad mínima por tienda activa.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>No se envía tienda_id; el backend usa la tienda activa.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventarioFilters
            buscar={buscar}
            bajoStock={bajoStock}
            categorias={catalogosQuery.data?.categorias}
            categoriaId={categoriaId}
            showBajoStock
            showCategoria
            onBajoStockChange={setBajoStock}
            onBuscarChange={setBuscar}
            onCategoriaChange={setCategoriaId}
          />
        </CardContent>
      </Card>

      {stockQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar el stock</AlertTitle>
          <AlertDescription>Revise la conexión con la API e intente nuevamente.</AlertDescription>
        </Alert>
      )}

      <StockTable isLoading={stockQuery.isLoading} stocks={filteredStocks} />
    </div>
  )
}
