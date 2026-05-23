import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import type { KeyboardEvent, RefObject } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { PosProductGrid } from "@/modules/pos/components/PosProductGrid"
import { PosProductSelectionModal } from "@/modules/pos/components/PosProductSelectionModal"
import { PosScannerStatus } from "@/modules/pos/components/PosScannerStatus"
import { PosSearchEmpty } from "@/modules/pos/components/PosSearchEmpty"
import { PosSearchSkeleton } from "@/modules/pos/components/PosSearchSkeleton"
import { usePosRefs } from "@/modules/pos/context/PosRefsContext"
import { useBarcodeScanner } from "@/modules/pos/hooks/useBarcodeScanner"
import { usePosProductSearch } from "@/modules/pos/hooks/usePosProductSearch"
import { useRecentProducts } from "@/modules/pos/hooks/useRecentProducts"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { posProductoService } from "@/modules/pos/services/posProducto.service"
import type { PosProductoLote, PosProductoPresentacion, PosProductoSearchItem } from "@/modules/pos/types/posProducto.types"
import { isLotExpired } from "@/modules/pos/utils/posCalculations"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"

export function PosSearchPanel({ inputRef }: { inputRef?: RefObject<HTMLInputElement | null> }) {
  const refs = usePosRefs()
  const effectiveInputRef = inputRef ?? refs.searchInputRef
  const [query, setQuery] = useState("")
  const [immediateQuery, setImmediateQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectionOpen, setSelectionOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<PosProductoSearchItem | null>(null)
  const [initialPresentation, setInitialPresentation] = useState<PosProductoPresentacion | null>(null)
  const addItem = usePosStore((state) => state.addItem)
  const { addRecentProduct } = useRecentProducts()
  const searchQuery = usePosProductSearch(query, immediateQuery)
  const quickQuery = useQuery({
    queryKey: ["pos", "productos", "rapidos"],
    queryFn: ({ signal }) => posProductoService.rapidos(signal),
    staleTime: 1000 * 60,
  })
  const isSearching = query.trim().length > 0 || immediateQuery.trim().length > 0
  const results = searchQuery.data ?? []
  const gridProducts = isSearching ? results : quickQuery.data ?? []

  const exactBarcodeResult = useMemo(() => {
    const value = (immediateQuery || query).trim()
    if (!value) return null
    return results.find((producto) => producto.presentaciones.some((presentacion) => presentacion.codigo_barra === value)) ?? null
  }, [results, immediateQuery, query])

  const resetSearch = useCallback(() => {
    setQuery("")
    setImmediateQuery("")
    setSelectedProduct(null)
    setInitialPresentation(null)
    window.setTimeout(() => effectiveInputRef.current?.focus(), 30)
  }, [effectiveInputRef])

  const validLots = useCallback((producto: PosProductoSearchItem) => {
    return producto.lotes.filter((lote) => lote.estado !== false && lote.stock_disponible_base > 0 && !isLotExpired(lote.fecha_vencimiento))
  }, [])

  const addDirect = useCallback((producto: PosProductoSearchItem, presentacion: PosProductoPresentacion, lote: PosProductoLote | null = null) => {
    const result = addItem({ producto, presentacion, lote, cantidad_presentacion: 1 })
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    addRecentProduct(producto)
    if (producto.requiere_receta) toast.warning("Producto agregado. Recuerda solicitar receta.")
    else toast.success("Producto agregado al carrito.")
    resetSearch()
  }, [addItem, addRecentProduct, resetSearch])

  const openSelection = useCallback((producto: PosProductoSearchItem, presentacion?: PosProductoPresentacion | null) => {
    setSelectedProduct(producto)
    setInitialPresentation(presentacion ?? null)
    setSelectionOpen(true)
  }, [])

  const handleSelectProduct = useCallback((producto: PosProductoSearchItem, forcedPresentation?: PosProductoPresentacion | null) => {
    const activePresentations = producto.presentaciones.filter((presentacion) => presentacion.estado !== false && presentacion.stock_disponible_base > 0)
    const chosenPresentation = forcedPresentation ?? activePresentations[0] ?? producto.presentaciones[0] ?? null

    if (!chosenPresentation) {
      toast.error("El producto no tiene presentaciones disponibles.")
      return
    }

    if (producto.maneja_lote) {
      const lots = validLots(producto)
      if (lots.length === 0) {
        toast.error("El producto no tiene lotes disponibles.")
        return
      }

      if (producto.presentaciones.length === 1 && lots.length === 1) {
        addDirect(producto, producto.presentaciones[0], lots[0])
        return
      }

      openSelection(producto, forcedPresentation ?? chosenPresentation)
      return
    }

    if (producto.presentaciones.length === 1) {
      addDirect(producto, producto.presentaciones[0], null)
      return
    }

    openSelection(producto, forcedPresentation ?? chosenPresentation)
  }, [addDirect, openSelection, validLots])

  const searchBarcode = useCallback(async (code: string) => {
    try {
      const productos = await posProductoService.buscar(code.trim())
      const producto = productos.find((item) => item.presentaciones.some((presentacion) => presentacion.codigo_barra === code.trim()))
      const presentacion = producto?.presentaciones.find((item) => item.codigo_barra === code.trim())

      if (!producto || !presentacion) {
        toast.error("Codigo de barra no encontrado.")
        return
      }

      handleSelectProduct(producto, presentacion)
    } catch {
      toast.error("No se pudo buscar el codigo de barra.")
    }
  }, [handleSelectProduct])

  const { isScannerEnabled, setScannerEnabled, lastScannedCode } = useBarcodeScanner({ enabled: true, onScan: searchBarcode })

  useEffect(() => {
    const timer = window.setTimeout(() => effectiveInputRef.current?.focus(), 80)
    return () => window.clearTimeout(timer)
  }, [effectiveInputRef])

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      const value = query.trim()
      setImmediateQuery(value)
      if (exactBarcodeResult) {
        const presentacion = exactBarcodeResult.presentaciones.find((item) => item.codigo_barra === value) ?? exactBarcodeResult.presentaciones[0]
        handleSelectProduct(exactBarcodeResult, presentacion)
      } else if (results[activeIndex]) {
        handleSelectProduct(results[activeIndex])
      }
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)))
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    }

    if (event.key === "Escape") {
      setQuery("")
      setImmediateQuery("")
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Buscar productos</CardTitle>
        <PosScannerStatus enabled={isScannerEnabled} lastCode={lastScannedCode} onToggle={() => setScannerEnabled(!isScannerEnabled)} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={effectiveInputRef}
            autoFocus
            aria-label="Buscar producto por nombre, codigo o codigo de barra"
            className="h-11 pl-9"
            placeholder="Buscar producto por nombre, codigo o codigo de barra..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value.trimStart())
              setImmediateQuery("")
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="max-h-[58vh] space-y-3 overflow-auto pr-1">
          {isSearching && searchQuery.isLoading && <PosSearchSkeleton />}
          {isSearching && searchQuery.isSubtleLoading && <p className="text-xs text-muted-foreground">Actualizando resultados...</p>}
          {isSearching && !searchQuery.isLoading && !searchQuery.isError && results.length === 0 && <PosSearchEmpty query={query} />}
          {!isSearching && <p className="text-xs font-medium text-muted-foreground">Productos rápidos</p>}
          <PosProductGrid
            productos={gridProducts}
            isLoading={isSearching ? searchQuery.isLoading : quickQuery.isLoading}
            isError={isSearching ? searchQuery.isError : quickQuery.isError}
            onSelect={handleSelectProduct}
          />
        </div>
      </CardContent>

      <PosProductSelectionModal
        open={selectionOpen}
        producto={selectedProduct}
        initialPresentation={initialPresentation}
        onOpenChange={setSelectionOpen}
        onAdded={() => {
          if (selectedProduct) addRecentProduct(selectedProduct)
          resetSearch()
        }}
      />
    </Card>
  )
}

