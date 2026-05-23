import { AlertTriangle } from "lucide-react"

import { formatQuantity } from "@/modules/pos/utils/posCalculations"

export function PosStockInfo({ stockBase, factorConversion, lowThreshold = 5 }: { stockBase: number; factorConversion: number; lowThreshold?: number }) {
  const stockPresentation = stockBase / Math.max(factorConversion, 0.0001)
  const isLow = stockBase > 0 && stockPresentation <= lowThreshold

  return (
    <div className="rounded-md bg-muted/50 p-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground">Stock base</span>
        <span className="font-semibold">{formatQuantity(stockBase)}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground">Equiv. presentacion</span>
        <span className="font-semibold">{formatQuantity(stockPresentation)}</span>
      </div>
      {isLow && (
        <div className="mt-1 flex items-center gap-1 text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5" />
          Bajo stock para esta presentacion
        </div>
      )}
    </div>
  )
}
