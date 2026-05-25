import { useState } from "react"
import { toast } from "sonner"

import { ProductoForm } from "@/modules/productos/components/ProductoForm"
import { useProductoCatalogos } from "@/modules/productos/hooks/useProductoCatalogos"
import { useCreateProducto } from "@/modules/productos/hooks/useProductoMutations"
import type { ProductoFormValues } from "@/modules/productos/schemas/producto.schema"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage, getLaravelValidationErrors, type LaravelValidationErrors } from "@/shared/services/api"

type CompraProductoModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

export function CompraProductoModal({ open, onOpenChange, onCreated }: CompraProductoModalProps) {
  const [serverErrors, setServerErrors] = useState<LaravelValidationErrors>({})
  const catalogosQuery = useProductoCatalogos()
  const createProducto = useCreateProducto()

  async function save(values: ProductoFormValues) {
    try {
      setServerErrors({})
      await createProducto.mutateAsync(values)
      toast.success("Producto creado correctamente.")
      onCreated?.()
      onOpenChange(false)
    } catch (error) {
      setServerErrors(getLaravelValidationErrors(error))
      toast.error(getLaravelErrorMessage(error, "No se pudo crear el producto."))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo producto</DialogTitle>
          <DialogDescription>Registra el producto sin salir de la compra actual.</DialogDescription>
        </DialogHeader>

        {catalogosQuery.isLoading && <Skeleton className="h-96 w-full" />}

        {catalogosQuery.isError && (
          <Alert variant="destructive">
            <AlertTitle>No se pudieron cargar los catalogos</AlertTitle>
            <AlertDescription>{getLaravelErrorMessage(catalogosQuery.error)}</AlertDescription>
          </Alert>
        )}

        {catalogosQuery.data && (
          <ProductoForm
            catalogos={catalogosQuery.data}
            isSubmitting={createProducto.isPending}
            serverErrors={serverErrors}
            submitLabel="Crear producto"
            onCancel={() => onOpenChange(false)}
            onSubmit={save}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
