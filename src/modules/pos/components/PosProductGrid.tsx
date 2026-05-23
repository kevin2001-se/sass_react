import { ImageIcon, Pill } from "lucide-react"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import type { PosProductoSearchItem } from "@/modules/pos/types/posProducto.types"
import { formatQuantity } from "@/modules/pos/utils/posCalculations"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function PosProductGrid({
  productos,
  isLoading,
  isError,
  onSelect,
}: {
  productos: PosProductoSearchItem[]
  isLoading?: boolean
  isError?: boolean
  onSelect: (producto: PosProductoSearchItem) => void
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 2xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => <Skeleton className="h-36 rounded-lg" key={index} />)}
      </div>
    )
  }

  if (isError) {
    return <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">No se pudo cargar la grilla de productos.</div>
  }

  if (productos.length === 0) {
    return <div className="rounded-md border border-dashed p-5 text-center text-sm text-muted-foreground">No hay productos con stock disponible.</div>
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 2xl:grid-cols-5">
      {productos.map((producto) => {
        const presentacion = producto.presentaciones[0]
        const stockBase = producto.maneja_lote
          ? producto.lotes.reduce((sum, lote) => sum + Number(lote.stock_disponible_base || 0), 0)
          : presentacion?.stock_disponible_base ?? 0

        return (
          <Card key={producto.id} className="overflow-hidden transition hover:border-primary/60 hover:shadow-sm">
            <CardContent className="p-0">
              <Button
                className="flex h-full min-h-36 w-full flex-col items-stretch justify-start gap-2 rounded-none p-3 text-left"
                type="button"
                variant="ghost"
                onClick={() => onSelect(producto)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-tight">{producto.nombre}</p>
                  <p className="truncate text-xs text-muted-foreground">{presentacion?.nombre ?? "Sin presentacion"}</p>
                </div>
                <div className="mt-auto space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-primary">{formatCurrency(presentacion?.precio_venta ?? 0)}</span>
                    <span className="text-xs text-muted-foreground">Stock {formatQuantity(stockBase)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {producto.requiere_receta && <Badge variant="secondary"><Pill className="mr-1 h-3 w-3" />Receta</Badge>}
                    {producto.maneja_lote && <Badge variant="outline">Lote</Badge>}
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

