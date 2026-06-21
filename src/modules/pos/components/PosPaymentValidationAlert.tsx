import { AlertTriangle, CheckCircle2 } from "lucide-react"

import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"

export function PosPaymentValidationAlert({ cajaAbierta }: { cajaAbierta: boolean }) {
  const total = usePosStore((state) => state.total)
  const paymentError = usePosStore((state) => state.paymentError)
  const puedeCobrar = usePosStore((state) => state.puedeCobrar)
  const tipoVenta = usePosStore((state) => state.tipoVenta)
  const totalPagado = usePosStore((state) => state.totalPagado)

  if (!cajaAbierta && (tipoVenta === "CONTADO" || totalPagado > 0)) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No hay caja abierta</AlertTitle>
        <AlertDescription>Debes aperturar caja para ventas contado o para registrar un pago inicial.</AlertDescription>
      </Alert>
    )
  }

  if (total <= 0) return null

  if (paymentError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Pago incompleto</AlertTitle>
        <AlertDescription>{paymentError}</AlertDescription>
      </Alert>
    )
  }

  if (puedeCobrar) {
    return (
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>{tipoVenta === "CREDITO" ? "Credito preparado" : "Pago completo"}</AlertTitle>
        <AlertDescription>
          {tipoVenta === "CREDITO" && totalPagado === 0
            ? "Venta al credito sin pago inicial. Se registrara una cuenta por cobrar y no movera caja."
            : tipoVenta === "CREDITO" ? "Pago inicial registrado. Se generara cuenta por cobrar por el saldo." : "Pago completo. Listo para registrar venta."}
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
