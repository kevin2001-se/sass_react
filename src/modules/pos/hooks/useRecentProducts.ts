import { useCallback, useMemo, useState } from "react"

import type { PosProductoSearchItem } from "@/modules/pos/types/posProducto.types"
import { useAuthStore } from "@/shared/stores/auth.store"

const MAX_RECENT = 10

function key(userId?: number | null, tiendaId?: number | null) {
  return `pos-recent-products:${userId ?? "no-user"}:${tiendaId ?? "no-store"}`
}

function read(keyName: string): PosProductoSearchItem[] {
  try {
    const raw = localStorage.getItem(keyName)
    return raw ? JSON.parse(raw) as PosProductoSearchItem[] : []
  } catch {
    return []
  }
}

export function useRecentProducts() {
  const userId = useAuthStore((state) => state.user?.id)
  const tiendaId = useAuthStore((state) => state.tiendaActiva?.id)
  const storageKey = useMemo(() => key(userId, tiendaId), [tiendaId, userId])
  const [recentProducts, setRecentProducts] = useState<PosProductoSearchItem[]>(() => read(storageKey))

  const refreshRecentProducts = useCallback(() => setRecentProducts(read(storageKey)), [storageKey])

  const addRecentProduct = useCallback((product: PosProductoSearchItem) => {
    const next = [product, ...read(storageKey).filter((item) => item.id !== product.id)].slice(0, MAX_RECENT)
    localStorage.setItem(storageKey, JSON.stringify(next))
    setRecentProducts(next)
  }, [storageKey])

  const clearRecentProducts = useCallback(() => {
    localStorage.removeItem(storageKey)
    setRecentProducts([])
  }, [storageKey])

  return { recentProducts, addRecentProduct, clearRecentProducts, refreshRecentProducts }
}