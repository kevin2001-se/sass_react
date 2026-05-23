import { memo } from "react"
import { Check } from "lucide-react"

import { PosExpirationBadge } from "@/modules/pos/components/PosExpirationBadge"
import type { PosProductoLote } from "@/modules/pos/types/posProducto.types"
import { formatQuantity, isLotExpired } from "@/modules/pos/utils/posCalculations"
import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/utils/cn"

export const PosLotCard = memo(function PosLotCard({ lote, selected, onSelect }: { lote: PosProductoLote; selected: boolean; onSelect: () => void }) {
  const expired = isLotExpired(lote.fecha_vencimiento)
  const disabled = lote.estado === false || expired || lote.stock_disponible_base <= 0

  return (
    <button
      className={cn(
        "w-full rounded-md border p-3 text-left transition",
        selected && "border-primary bg-primary/5 ring-1 ring-primary",
        !disabled && "hover:border-primary/70 hover:bg-primary/5",
        disabled && "cursor-not-allowed opacity-50",
      )}
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{lote.codigo_lote}</p>
            {selected && <Check className="h-4 w-4 text-primary" />}
            {lote.sugerido_fefo && <Badge>FEFO</Badge>}
            <PosExpirationBadge fecha={lote.fecha_vencimiento} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Vence: {lote.fecha_vencimiento ?? "Sin fecha"}</p>
        </div>
        <div className="text-right text-xs">
          <p className="text-muted-foreground">Stock base</p>
          <p className="font-bold">{formatQuantity(lote.stock_disponible_base)}</p>
        </div>
      </div>
      {disabled && <p className="mt-2 text-xs text-destructive">Lote no disponible para venta.</p>}
    </button>
  )
})
