import { AlertTriangle, Package, Pill } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { PosLotCard } from "@/modules/pos/components/PosLotCard"
import { PosPresentationCard } from "@/modules/pos/components/PosPresentationCard"
import { PosStockInfo } from "@/modules/pos/components/PosStockInfo"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import type { PosProductoPresentacion, PosProductoSearchItem } from "@/modules/pos/types/posProducto.types"
import { formatQuantity, isLotExpired } from "@/modules/pos/utils/posCalculations"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Separator } from "@/shared/components/ui/separator"

export function PosProductSelectionModal({
  open,
  producto,
  initialPresentation,
  onOpenChange,
  onAdded,
}: {
  open: boolean
  producto: PosProductoSearchItem | null
  initialPresentation?: PosProductoPresentacion | null
  onOpenChange: (open: boolean) => void
  onAdded?: () => void
}) {
  const addItem = usePosStore((state) => state.addItem)
  const [selectedPresentationId, setSelectedPresentationId] = useState<number | null>(null)
  const [selectedLoteId, setSelectedLoteId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState("1")

  const validLotes = useMemo(() => {
    return (producto?.lotes ?? []).slice().sort((a, b) => {
      const first = a.fecha_vencimiento ?? "9999-12-31"
      const second = b.fecha_vencimiento ?? "9999-12-31"
      return first.localeCompare(second)
    })
  }, [producto?.lotes])

  const selectedPresentation = producto?.presentaciones.find((item) => item.id === selectedPresentationId) ?? null
  const selectedLote = validLotes.find((item) => item.id === selectedLoteId) ?? null
  const stockBase = producto?.maneja_lote ? selectedLote?.stock_disponible_base ?? 0 : selectedPresentation?.stock_disponible_base ?? 0
  const quantityNumber = Number(quantity)
  const requestedBase = selectedPresentation ? quantityNumber * selectedPresentation.factor_conversion : 0
  const hasStock = requestedBase > 0 && requestedBase <= stockBase

  useEffect(() => {
    if (!open || !producto) return
    const firstPresentation = initialPresentation ?? producto.presentaciones.find((item) => item.estado !== false && item.stock_disponible_base > 0) ?? producto.presentaciones[0] ?? null
    const fefoLot = producto.lotes.find((item) => item.sugerido_fefo && item.stock_disponible_base > 0 && !isLotExpired(item.fecha_vencimiento))
    const firstValidLot = producto.lotes.find((item) => item.stock_disponible_base > 0 && !isLotExpired(item.fecha_vencimiento))

    setSelectedPresentationId(firstPresentation?.id ?? null)
    setSelectedLoteId(producto.maneja_lote ? (fefoLot ?? firstValidLot)?.id ?? null : null)
    setQuantity("1")
  }, [open, producto, initialPresentation])

  function handleAdd() {
    if (!producto) return
    if (!selectedPresentation) {
      toast.error("Seleccione una presentacion.")
      return
    }
    if (selectedPresentation.estado === false) {
      toast.error("La presentacion no esta activa.")
      return
    }
    if (producto.maneja_lote && !selectedLote) {
      toast.error("Seleccione un lote para este producto.")
      return
    }
    if (selectedLote && isLotExpired(selectedLote.fecha_vencimiento)) {
      toast.error("No se puede vender un lote vencido.")
      return
    }
    if (!Number.isFinite(quantityNumber) || quantityNumber <= 0) {
      toast.error("La cantidad debe ser mayor a 0.")
      return
    }
    if (!hasStock) {
      toast.error("No hay stock suficiente para la presentacion y lote seleccionados.")
      return
    }

    const result = addItem({ producto, presentacion: selectedPresentation, lote: selectedLote, cantidad_presentacion: quantityNumber })
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    if (producto.requiere_receta) {
      toast.warning("Producto agregado. Recuerda solicitar receta.")
    } else {
      toast.success("Producto agregado al carrito.")
    }
    onOpenChange(false)
    onAdded?.()
  }

  if (!producto) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Seleccionar producto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-md border p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                <p className="text-sm text-muted-foreground">{producto.codigo_interno}{producto.concentracion ? ` · ${producto.concentracion}` : ""}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {producto.categoria?.nombre ?? "Sin categoria"} · {producto.laboratorio?.nombre ?? "Sin laboratorio"} · {producto.principio_activo?.nombre ?? "Sin principio activo"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {producto.requiere_receta && <Badge variant="secondary">Requiere receta</Badge>}
                {producto.maneja_lote && <Badge variant="outline">Maneja lote</Badge>}
                {producto.maneja_vencimiento && <Badge variant="outline">Maneja vencimiento</Badge>}
              </div>
            </div>
          </div>

          {producto.requiere_receta && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Producto con receta</AlertTitle>
              <AlertDescription>El POS permite agregarlo, pero el vendedor debe verificar la receta antes de finalizar la venta.</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">Presentaciones</h4>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {producto.presentaciones.map((presentacion) => (
                  <PosPresentationCard
                    key={presentacion.id}
                    presentacion={presentacion}
                    selected={selectedPresentationId === presentacion.id}
                    stockBaseOverride={producto.maneja_lote ? stockBase : undefined}
                    onSelect={() => setSelectedPresentationId(presentacion.id)}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="font-semibold">{producto.maneja_lote ? "Lotes disponibles" : "Stock disponible"}</h4>
              {producto.maneja_lote ? (
                validLotes.length === 0 ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Sin lotes disponibles</AlertTitle>
                    <AlertDescription>El producto no tiene lotes con stock para esta tienda.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="max-h-[340px] space-y-2 overflow-auto pr-1">
                    {validLotes.map((lote) => (
                      <PosLotCard key={lote.id} lote={lote} selected={selectedLoteId === lote.id} onSelect={() => setSelectedLoteId(lote.id)} />
                    ))}
                  </div>
                )
              ) : selectedPresentation ? (
                <PosStockInfo stockBase={selectedPresentation.stock_disponible_base} factorConversion={selectedPresentation.factor_conversion} />
              ) : (
                <p className="text-sm text-muted-foreground">Seleccione una presentacion.</p>
              )}
            </section>
          </div>

          <Separator />

          <div className="grid gap-3 md:grid-cols-[180px_1fr] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="pos-product-quantity">Cantidad</Label>
              <Input
                id="pos-product-quantity"
                inputMode="decimal"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </div>
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cantidad base requerida</span>
                <span className="font-semibold">{formatQuantity(requestedBase)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stock base disponible</span>
                <span className="font-semibold">{formatQuantity(stockBase)}</span>
              </div>
              {!hasStock && quantityNumber > 0 && <p className="mt-1 text-xs text-destructive">Stock insuficiente para esta combinacion.</p>}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="button" disabled={!selectedPresentation || (producto.maneja_lote && !selectedLote) || !hasStock} onClick={handleAdd}>
            Agregar al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

