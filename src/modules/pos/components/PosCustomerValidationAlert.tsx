import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { useMemo } from "react"

import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"

export function PosCustomerValidationAlert() {
  const cliente = usePosStore((state) => state.cliente)
  const tipoComprobante = usePosStore((state) => state.tipoComprobante)
  const total = usePosStore((state) => state.total)

  const validation = useMemo(() => {
    if (tipoComprobante === "NOTA_VENTA") return { ok: true as const }

    if (tipoComprobante === "FACTURA") {
      if (!cliente || cliente.es_cliente_varios || cliente.tipo_documento !== "RUC") {
        return { ok: false as const, message: "Para factura debe seleccionar un cliente con RUC." }
      }
      return { ok: true as const }
    }

    if (tipoComprobante === "BOLETA" && total > 700) {
      if (!cliente || cliente.es_cliente_varios || !["DNI", "RUC"].includes(cliente.tipo_documento)) {
        return { ok: false as const, message: "Para boleta mayor a S/ 700 debe seleccionar cliente con DNI o RUC." }
      }
    }

    return { ok: true as const }
  }, [cliente, tipoComprobante, total])

  if (!validation.ok) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Cliente requerido</AlertTitle>
        <AlertDescription>{validation.message}</AlertDescription>
      </Alert>
    )
  }

  if (tipoComprobante === "BOLETA" && total <= 700 && (!cliente || cliente.es_cliente_varios)) {
    return (
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Cliente varios permitido</AlertTitle>
        <AlertDescription>Para boleta menor o igual a S/ 700 puedes continuar con cliente varios.</AlertDescription>
      </Alert>
    )
  }

  return null
}
