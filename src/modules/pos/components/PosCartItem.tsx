import { memo } from "react"
import { Trash2 } from "lucide-react"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { PosItemDiscountControl } from "@/modules/pos/components/PosItemDiscountControl"
import { PosItemQuantityControl } from "@/modules/pos/components/PosItemQuantityControl"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import type { PosCartItem as PosCartItemType } from "@/modules/pos/types/pos.types"
import { formatQuantity, isLotNearExpiration } from "@/modules/pos/utils/posCalculations"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

export const PosCartItem = memo(function PosCartItem({ item }: { item: PosCartItemType }) {
  const removeItem = usePosStore((state) => state.removeItem)
  const nearExpiration = isLotNearExpiration(item.fecha_vencimiento)
  const secondaryInfo = [
    item.lote_codigo ? `Lote: ${item.lote_codigo}` : null,
    item.fecha_vencimiento ? `Vence: ${item.fecha_vencimiento}` : null,
    `Stock base: ${formatQuantity(item.stock_disponible_base)}`,
  ].filter(Boolean).join(" · ")

  return (
    <div className="rounded-md border bg-background p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{item.producto_nombre}</p>
          <p className="truncate text-xs text-muted-foreground">{item.presentacion_nombre}</p>
        </div>
        <Button aria-label="Eliminar item" size="icon" variant="ghost" onClick={() => removeItem(item.itemKey)} title="Eliminar item">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {item.requiere_receta && <Badge variant="secondary">Receta</Badge>}
        {item.maneja_lote && <Badge variant="outline">Lote</Badge>}
        {nearExpiration && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Por vencer</Badge>}
      </div>

      <p className="mt-2 truncate text-[11px] text-muted-foreground" title={secondaryInfo}>{secondaryInfo}</p>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-3">
        <PosItemQuantityControl itemKey={item.itemKey} quantity={item.cantidad_presentacion} />
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Precio</p>
          <p className="font-semibold">{formatCurrency(item.precio_unitario)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-muted/40 p-2">
        <div className="min-w-0 flex-1">
          <PosItemDiscountControl itemKey={item.itemKey} discount={item.descuento} />
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-base font-bold text-primary">{formatCurrency(item.total)}</p>
        </div>
      </div>
    </div>
  )
})

