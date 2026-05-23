import { toast } from "sonner"

import { InventarioMovimientoForm } from "@/modules/inventario/components/InventarioMovimientoForm"
import { useAjusteInventario } from "@/modules/inventario/hooks/useInventarioMutations"
import { useLotes } from "@/modules/inventario/hooks/useLotes"
import { useProductos } from "@/modules/productos/hooks/useProductos"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function AjusteInventarioPage() {
  const productosQuery = useProductos({ per_page: 100, estado: "true" })
  const lotesQuery = useLotes({ estado: "true", per_page: 100 })
  const ajusteMutation = useAjusteInventario()

  async function onSubmit(values: Parameters<typeof ajusteMutation.mutateAsync>[0]) {
    try {
      await ajusteMutation.mutateAsync(values)
      toast.success("Ajuste de inventario registrado correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo registrar el ajuste."))
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Ajuste de inventario</h1>
        <p className="text-sm text-muted-foreground">Registra diferencias positivas o negativas de stock físico.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar ajuste</CardTitle>
          <CardDescription>El backend bloquea stock y no permite cantidades negativas.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventarioMovimientoForm
            isSubmitting={ajusteMutation.isPending}
            lotes={lotesQuery.data?.data ?? []}
            mode="ajuste"
            productos={productosQuery.data?.data ?? []}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
