import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"

import { useRecentProducts } from "@/modules/pos/hooks/useRecentProducts"
import { posProductoService } from "@/modules/pos/services/posProducto.service"
import type { PosProductoSearchItem } from "@/modules/pos/types/posProducto.types"

export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timeout)
  }, [value, delay])

  return debounced
}

function isLikelyBarcode(value: string) {
  return /^[A-Za-z0-9-]{6,}$/.test(value.trim())
}

export function usePosProductSearch(query: string, immediateQuery?: string, debounceMs = 300) {
  const { recentProducts } = useRecentProducts()
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  const q = (immediateQuery || debouncedQuery).trim()
  const canSearch = q.length >= 2 || isLikelyBarcode(q)

  const search = useQuery<PosProductoSearchItem[]>({
    queryKey: ["pos", "productos", "buscar", q],
    queryFn: ({ signal }) => posProductoService.buscar(q, signal),
    enabled: canSearch,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
    retry: 1,
  })

  return useMemo(() => ({
    ...search,
    data: canSearch ? search.data : recentProducts,
    isRecent: !canSearch,
    isSubtleLoading: search.isFetching && !search.isLoading,
  }), [canSearch, recentProducts, search])
}