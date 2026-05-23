import { AlertTriangle } from "lucide-react"

import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

export function PosSaleTypeSelector() {
  const tipoVenta = usePosStore((state) => state.tipoVenta)
  const setTipoVenta = usePosStore((state) => state.setTipoVenta)

  return (
    <div className="space-y-2">
      <Tabs value={tipoVenta} onValueChange={(value) => setTipoVenta(value as "CONTADO" | "CREDITO")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="CONTADO">Contado</TabsTrigger>
          <TabsTrigger value="CREDITO">Credito</TabsTrigger>
        </TabsList>
      </Tabs>
      {tipoVenta === "CREDITO" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Venta al credito</AlertTitle>
          <AlertDescription>La venta al credito generara una cuenta por cobrar cuando se registre.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
