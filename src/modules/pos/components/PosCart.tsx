import { memo, useMemo } from "react"
import { ShoppingCart, Trash2 } from "lucide-react"

import { PosCartItem } from "@/modules/pos/components/PosCartItem"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { selectPosItems } from "@/modules/pos/stores/pos.selectors"
import { formatQuantity } from "@/modules/pos/utils/posCalculations"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

export const PosCart = memo(function PosCart() {
  const items = usePosStore(selectPosItems)
  const totalItems = usePosStore((state) => state.totalItems)
  const cantidadProductos = usePosStore((state) => state.cantidadProductos)
  const clearCart = usePosStore((state) => state.clearCart)
  const renderedItems = useMemo(() => items.map((item) => <PosCartItem item={item} key={item.itemKey} />), [items])

  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-4 w-4" />
            Carrito
          </CardTitle>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">{cantidadProductos} productos</Badge>
            <Badge variant="outline">{formatQuantity(totalItems)} unidades</Badge>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button aria-label="Limpiar carrito" disabled={!items.length} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
              Limpiar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Limpiar carrito</AlertDialogTitle>
              <AlertDialogDescription>
                Se quitaran todos los productos y pagos cargados en esta venta en curso.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={clearCart}>Limpiar carrito</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-auto pr-2">
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Agrega productos para iniciar la venta.
          </div>
        ) : (
          <div className="space-y-2">{renderedItems}</div>
        )}
      </CardContent>
    </Card>
  )
})

