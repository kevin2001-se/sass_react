import { Plus } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { ProductoBarcodeAutoToggle } from "@/modules/productos/components/ProductoBarcodeAutoToggle"
import { ProductoFilters } from "@/modules/productos/components/ProductoFilters"
import { ProductosTable } from "@/modules/productos/components/ProductosTable"
import { useProductoCatalogos } from "@/modules/productos/hooks/useProductoCatalogos"
import { useDeleteProducto } from "@/modules/productos/hooks/useProductoMutations"
import { useProductos } from "@/modules/productos/hooks/useProductos"
import type { Producto, ProductoFilters as ProductoFiltersType } from "@/modules/productos/types/producto.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function ProductosPage() {
  const [filters, setFilters] = useState<ProductoFiltersType>({ page: 1, per_page: 15 })
  const productosQuery = useProductos(filters)
  const catalogosQuery = useProductoCatalogos()
  const deleteProducto = useDeleteProducto()

  async function handleDelete(producto: Producto) {
    try {
      await deleteProducto.mutateAsync(producto.id)
      toast.success("Producto desactivado correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo desactivar el producto."))
    }
  }

  const productos = productosQuery.data?.data ?? []
  const meta = productosQuery.data?.meta

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Productos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Catálogo empresarial de productos y presentaciones.
          </p>
        </div>
        <Button asChild>
          <Link to="/productos/crear">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          {catalogosQuery.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <ProductoFilters
              categorias={catalogosQuery.data?.categorias ?? []}
              filters={filters}
              onChange={setFilters}
            />
          )}
        </CardContent>
      </Card>

      <ProductoBarcodeAutoToggle />

      {productosQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudieron cargar los productos</AlertTitle>
          <AlertDescription>
            {getLaravelErrorMessage(productosQuery.error, "Verifica tus permisos o conexión.")}
          </AlertDescription>
        </Alert>
      )}

      <ProductosTable
        isDeleting={deleteProducto.isPending}
        isLoading={productosQuery.isLoading}
        productos={productos}
        onDelete={handleDelete}
      />

      {meta && (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            Mostrando {meta.from ?? 0}-{meta.to ?? 0} de {meta.total}
          </span>
          <div className="flex gap-2">
            <Button
              disabled={meta.current_page <= 1}
              size="sm"
              variant="outline"
              onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) - 1 }))}
            >
              Anterior
            </Button>
            <Button
              disabled={meta.current_page >= meta.last_page}
              size="sm"
              variant="outline"
              onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) + 1 }))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
