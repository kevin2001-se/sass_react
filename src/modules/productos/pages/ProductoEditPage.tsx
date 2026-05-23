import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"

import { ProductoForm } from "@/modules/productos/components/ProductoForm"
import { useProducto } from "@/modules/productos/hooks/useProducto"
import { useProductoCatalogos } from "@/modules/productos/hooks/useProductoCatalogos"
import { useUpdateProducto } from "@/modules/productos/hooks/useProductoMutations"
import type { ProductoFormValues } from "@/modules/productos/schemas/producto.schema"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage, getLaravelValidationErrors, type LaravelValidationErrors } from "@/shared/services/api"

export function ProductoEditPage() {
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState<LaravelValidationErrors>({})
  const params = useParams()
  const productoId = Number(params.id)
  const productoQuery = useProducto(productoId)
  const catalogosQuery = useProductoCatalogos()
  const updateProducto = useUpdateProducto(productoId)

  async function handleSubmit(values: ProductoFormValues) {
    try {
      setServerErrors({})
      await updateProducto.mutateAsync(values)
      toast.success("Producto actualizado correctamente.")
      navigate("/productos")
    } catch (error) {
      setServerErrors(getLaravelValidationErrors(error))
      toast.error(getLaravelErrorMessage(error, "No se pudo actualizar el producto."))
    }
  }

  const isLoading = productoQuery.isLoading || catalogosQuery.isLoading

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Editar producto</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Actualiza datos generales, farmacéuticos y presentaciones.
        </p>
      </div>

      {isLoading && <Skeleton className="h-96 w-full" />}

      {(productoQuery.isError || catalogosQuery.isError) && (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar el producto</AlertTitle>
          <AlertDescription>
            {getLaravelErrorMessage(productoQuery.error ?? catalogosQuery.error)}
          </AlertDescription>
        </Alert>
      )}

      {productoQuery.data && catalogosQuery.data && (
        <ProductoForm
          catalogos={catalogosQuery.data}
          isSubmitting={updateProducto.isPending}
          producto={productoQuery.data}
          serverErrors={serverErrors}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
