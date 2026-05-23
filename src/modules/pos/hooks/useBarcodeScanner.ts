import { useCallback, useEffect, useRef, useState } from "react"

type BarcodeScannerOptions = {
  enabled?: boolean
  maxDelayMs?: number
  minLength?: number
  onScan: (code: string) => void
}

function shouldIgnoreTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null
  if (!element) return false
  const tag = element.tagName.toLowerCase()
  return tag === "textarea" || tag === "select" || element.closest("[role='dialog']") !== null
}

export function useBarcodeScanner({ enabled = true, maxDelayMs = 60, minLength = 6, onScan }: BarcodeScannerOptions) {
  const bufferRef = useRef("")
  const lastKeyAtRef = useRef(0)
  const lastScanRef = useRef("")
  const [isScannerEnabled, setScannerEnabled] = useState(enabled)
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)

  useEffect(() => setScannerEnabled(enabled), [enabled])

  const resetBuffer = useCallback(() => { bufferRef.current = "" }, [])

  useEffect(() => {
    if (!isScannerEnabled) return

    function onKeyDown(event: KeyboardEvent) {
      if (shouldIgnoreTarget(event.target)) return

      const now = Date.now()
      if (now - lastKeyAtRef.current > maxDelayMs) resetBuffer()
      lastKeyAtRef.current = now

      if (event.key === "Enter") {
        const code = bufferRef.current.trim()
        resetBuffer()
        if (code.length < minLength) return
        const signature = `${code}-${Math.floor(now / 500)}`
        if (lastScanRef.current === signature) return
        lastScanRef.current = signature
        setLastScannedCode(code)
        onScan(code)
        return
      }

      if (event.key.length === 1) bufferRef.current += event.key
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isScannerEnabled, maxDelayMs, minLength, onScan, resetBuffer])

  return { isScannerEnabled, setScannerEnabled, lastScannedCode }
}