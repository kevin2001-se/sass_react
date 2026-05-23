import { memo } from "react"
import { Check } from "lucide-react"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { PosStockInfo } from "@/modules/pos/components/PosStockInfo"
import type { PosProductoPresentacion } from "@/modules/pos/types/posProducto.types"
import { cn } from "@/shared/utils/cn"

export const PosPresentationCard = memo(function PosPresentationCard({
  presentacion,
  selected,
  disabled,
  stockBaseOverride,
  onSelect,
}: {
  presentacion: PosProductoPresentacion
  selected: boolean
  disabled?: boolean
  stockBaseOverride?: number
  onSelect: () => void
}) {
  const stockBase = stockBaseOverride ?? presentacion.stock_disponible_base
  const isDisabled = disabled || presentacion.estado === false || stockBase <= 0

  return (
    <button
      className={cn(
        "w-full rounded-md border p-3 text-left transition",
        selected && "border-primary bg-primary/5 ring-1 ring-primary",
        !isDisabled && "hover:border-primary/70 hover:bg-primary/5",
        isDisabled && "cursor-not-allowed opacity-50",
      )}
      disabled={isDisabled}
      type="button"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{presentacion.nombre}</p>
            {selected && <Check className="h-4 w-4 text-primary" />}
          </div>
          <p className="text-xs text-muted-foreground">Factor {presentacion.factor_conversion}</p>
          {presentacion.codigo_barra && <p className="text-xs text-muted-foreground">Cod. barra {presentacion.codigo_barra}</p>}
        </div>
        <span className="font-bold text-primary">{formatCurrency(presentacion.precio_venta)}</span>
      </div>
      <div className="mt-3">
        <PosStockInfo stockBase={stockBase} factorConversion={presentacion.factor_conversion} />
      </div>
      {isDisabled && <p className="mt-2 text-xs text-destructive">Sin stock suficiente para esta presentacion.</p>}
    </button>
  )
})
