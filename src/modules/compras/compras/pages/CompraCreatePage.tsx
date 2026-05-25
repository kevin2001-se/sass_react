import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { CompraForm } from "@/modules/compras/compras/components/CompraForm"
import { useCompraMutations } from "@/modules/compras/compras/hooks/useCompraMutations"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import type { CompraPayload } from "@/modules/compras/compras/types/compra.types"

export function CompraCreatePage() {
  const navigate = useNavigate()
  const mutations = useCompraMutations()

  async function save(values: CompraPayload) {
    try {
      await mutations.registrar.mutateAsync(values)
      toast.success("Compra registrada correctamente. Stock actualizado en la tienda activa.")
      navigate("/compras/historial")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo registrar la compra."))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Registrar compra</h1>
          <p className="text-sm text-muted-foreground">Ingresa compras de proveedor y actualiza stock/lotes de la tienda activa.</p>
        </div>
        <Button type="button" variant="outline" onClick={() => navigate("/compras/proveedores")}>Proveedores</Button>
      </div>

      <Alert>
        <AlertTitle>Stock por tienda, lotes por empresa</AlertTitle>
        <AlertDescription>Si el producto maneja lote puedes elegir uno existente o escribir un nuevo codigo. El stock se incrementa solo en la tienda activa.</AlertDescription>
      </Alert>

      <CompraForm loading={mutations.registrar.isPending} serverErrors={getLaravelValidationErrors(mutations.registrar.error)} onSubmit={save} />
    </div>
  )
}
