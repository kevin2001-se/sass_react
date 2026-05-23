import { toast } from "sonner"

import { InventarioMovimientoForm } from "@/modules/inventario/components/InventarioMovimientoForm"
import { useSalidaInventario } from "@/modules/inventario/hooks/useInventarioMutations"
import { useLotes } from "@/modules/inventario/hooks/useLotes"
import { useProductos } from "@/modules/productos/hooks/useProductos"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function SalidaInventarioPage() {
  const productosQuery = useProductos({ per_page: 100, estado: "true" })
  const lotesQuery = useLotes({ estado: "true", per_page: 100 })
  const salidaMutation = useSalidaInventario()

  async function onSubmit(values: Parameters<typeof salidaMutation.mutateAsync>[0]) {
    try {
      await salidaMutation.mutateAsync(values)
      toast.success("Salida de inventario registrada correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo registrar la salida."))
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Salida de inventario</h1>
        <p className="text-sm text-muted-foreground">Resta stock usando presentaciones. En productos con lote se sugiere FEFO.</p>
      </div>

      <Alert>
        <AlertTitle>FEFO</AlertTitle>
        <AlertDescription>Para productos con vencimiento, seleccione primero el lote que vence antes.</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Registrar salida</CardTitle>
          <CardDescription>Puede usarse para mermas, consumo interno o salidas manuales.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventarioMovimientoForm
            isSubmitting={salidaMutation.isPending}
            lotes={lotesQuery.data?.data ?? []}
            mode="salida"
            productos={productosQuery.data?.data ?? []}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
