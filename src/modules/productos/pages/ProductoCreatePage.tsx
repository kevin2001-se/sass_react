import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"

import { ProductoForm } from "@/modules/productos/components/ProductoForm"
import { useProductoCatalogos } from "@/modules/productos/hooks/useProductoCatalogos"
import { useCreateProducto } from "@/modules/productos/hooks/useProductoMutations"
import type { ProductoFormValues } from "@/modules/productos/schemas/producto.schema"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage, getLaravelValidationErrors, type LaravelValidationErrors } from "@/shared/services/api"

export function ProductoCreatePage() {
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState<LaravelValidationErrors>({})
  const catalogosQuery = useProductoCatalogos()
  const createProducto = useCreateProducto()

  async function handleSubmit(values: ProductoFormValues) {
    try {
      setServerErrors({})
      await createProducto.mutateAsync(values)
      toast.success("Producto creado correctamente.")
      navigate("/productos")
    } catch (error) {
      setServerErrors(getLaravelValidationErrors(error))
      toast.error(getLaravelErrorMessage(error, "No se pudo crear el producto."))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Nuevo producto</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registra datos generales, farmacéuticos y presentaciones.
        </p>
      </div>

      {catalogosQuery.isLoading && <Skeleton className="h-96 w-full" />}

      {catalogosQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudieron cargar los catálogos</AlertTitle>
          <AlertDescription>{getLaravelErrorMessage(catalogosQuery.error)}</AlertDescription>
        </Alert>
      )}

      {catalogosQuery.data && (
        <ProductoForm
          catalogos={catalogosQuery.data}
          isSubmitting={createProducto.isPending}
          serverErrors={serverErrors}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
