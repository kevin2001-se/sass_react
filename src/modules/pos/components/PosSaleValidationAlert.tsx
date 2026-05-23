import { AlertTriangle } from "lucide-react"

import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"

export function PosSaleValidationAlert({ cajaAbierta }: { cajaAbierta: boolean }) {
  const total = usePosStore((state) => state.total)
  const items = usePosStore((state) => state.items)
  const paymentError = usePosStore((state) => state.paymentError)
  const validateBeforeRegister = usePosStore((state) => state.validateBeforeRegister)

  if (items.length === 0) return null

  const validation = validateBeforeRegister(cajaAbierta)
  const message = validation.ok ? null : validation.message ?? paymentError

  if (!message || total <= 0) return null

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Venta aun no lista</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
