import { Layers, Package } from "lucide-react"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { PosExpirationBadge } from "@/modules/pos/components/PosExpirationBadge"
import type { PosProductoSearchItem } from "@/modules/pos/types/posProducto.types"
import { formatQuantity } from "@/modules/pos/utils/posCalculations"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"

export function PosProductSearchResult({
  producto,
  active,
  onSelect,
}: {
  producto: PosProductoSearchItem
  active?: boolean
  onSelect: (producto: PosProductoSearchItem) => void
}) {
  const stock = producto.presentaciones[0]?.stock_disponible_base ?? 0
  const fefo = producto.lotes.find((lote) => lote.sugerido_fefo)

  return (
    <Card className={active ? "border-primary bg-primary/5" : "hover:border-primary/50"}>
      <CardContent className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{producto.nombre}</p>
            <p className="text-xs text-muted-foreground">{producto.codigo_interno}{producto.concentracion ? ` · ${producto.concentracion}` : ""}</p>
          </div>
          <Button size="sm" onClick={() => onSelect(producto)}>Agregar</Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {producto.requiere_receta && <Badge variant="outline">Receta</Badge>}
          {producto.maneja_lote && <Badge variant="outline">Lote</Badge>}
          {producto.maneja_vencimiento && <Badge variant="outline">Vencimiento</Badge>}
          <Badge variant="secondary">Stock base {formatQuantity(stock)}</Badge>
        </div>
        <div className="grid gap-1 text-xs text-muted-foreground md:grid-cols-3">
          <span>{producto.categoria?.nombre ?? "Sin categoria"}</span>
          <span>{producto.laboratorio?.nombre ?? "Sin laboratorio"}</span>
          <span>{producto.principio_activo?.nombre ?? "Sin principio"}</span>
        </div>
        {fefo && (
          <div className="rounded-md border bg-muted/40 p-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>FEFO</Badge>
              <span className="font-medium">{fefo.codigo_lote}</span>
              <PosExpirationBadge fecha={fefo.fecha_vencimiento} />
              <span className="text-muted-foreground">Stock {formatQuantity(fefo.stock_disponible_base)}</span>
            </div>
          </div>
        )}
        <Separator />
        <div className="grid gap-2 md:grid-cols-2">
          {producto.presentaciones.map((presentacion) => {
            const disabled = presentacion.estado === false || presentacion.stock_disponible_base <= 0
            return (
              <div className={disabled ? "rounded-md border p-2 text-xs opacity-50" : "rounded-md border p-2 text-xs"} key={presentacion.id}>
                <div className="flex justify-between gap-2">
                  <span className="flex items-center gap-1 font-medium"><Layers className="h-3.5 w-3.5" />{presentacion.nombre}</span>
                  <span>{formatCurrency(presentacion.precio_venta)}</span>
                </div>
                <p className="text-muted-foreground">Disponible: {formatQuantity(presentacion.stock_disponible_presentacion)}</p>
              </div>
            )
          })}
        </div>
        {producto.lotes.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            {producto.lotes.length} lote(s) disponible(s), ordenados por FEFO.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
