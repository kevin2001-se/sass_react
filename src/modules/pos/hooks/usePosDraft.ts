import { useCallback, useEffect, useMemo, useState } from "react"

import type { PosDraftSale } from "@/modules/pos/types/pos.types"
import { useAuthStore } from "@/shared/stores/auth.store"

type PosDraft = PosDraftSale & { updated_at: string }

function storageKey(userId?: number | null, tiendaId?: number | null) {
  return `pos-draft:${userId ?? "no-user"}:${tiendaId ?? "no-store"}`
}

function readDraft(key: string): PosDraft | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as PosDraft : null
  } catch {
    return null
  }
}

export function usePosDraft(snapshot: Omit<PosDraft, "updated_at">, enabled = true) {
  const userId = useAuthStore((state) => state.user?.id)
  const tiendaId = useAuthStore((state) => state.tiendaActiva?.id)
  const key = useMemo(() => storageKey(userId, tiendaId), [tiendaId, userId])
  const [draft, setDraft] = useState<PosDraft | null>(() => readDraft(key))

  useEffect(() => {
    setDraft(readDraft(key))
  }, [key])

  useEffect(() => {
    if (!enabled || !userId || !tiendaId) return
    const handle = window.setTimeout(() => {
      if (snapshot.items.length === 0) return
      const next = { ...snapshot, updated_at: new Date().toISOString() }
      localStorage.setItem(key, JSON.stringify(next))
      setDraft(next)
    }, 500)
    return () => window.clearTimeout(handle)
  }, [enabled, key, snapshot, tiendaId, userId])


  useEffect(() => {
    function handleClearDraft() {
      localStorage.removeItem(key)
      setDraft(null)
    }

    window.addEventListener("pos:draft-clear", handleClearDraft)
    return () => window.removeEventListener("pos:draft-clear", handleClearDraft)
  }, [key])
  const clearDraft = useCallback(() => {
    localStorage.removeItem(key)
    setDraft(null)
  }, [key])

  const getDraft = useCallback(() => readDraft(key), [key])

  return { draft, getDraft, clearDraft }
}

