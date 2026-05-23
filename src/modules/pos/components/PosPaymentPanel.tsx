import { memo, useCallback, useState } from "react"
import { Banknote, CreditCard, Landmark, Smartphone, Wallet } from "lucide-react"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { PosPaymentForm } from "@/modules/pos/components/PosPaymentForm"
import { PosPaymentList } from "@/modules/pos/components/PosPaymentList"
import { PosPaymentMethodButton } from "@/modules/pos/components/PosPaymentMethodButton"
import { PosPaymentSummary } from "@/modules/pos/components/PosPaymentSummary"
import { PosPaymentValidationAlert } from "@/modules/pos/components/PosPaymentValidationAlert"
import { PosSaleTypeSelector } from "@/modules/pos/components/PosSaleTypeSelector"
import { usePosRefs } from "@/modules/pos/context/PosRefsContext"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import type { PosMetodoPago } from "@/modules/pos/types/pos.types"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"

const methodButtons: Array<{ metodo: PosMetodoPago; label: string; icon: typeof Banknote }> = [
  { metodo: "EFECTIVO", label: "Efectivo", icon: Banknote },
  { metodo: "YAPE", label: "Yape", icon: Smartphone },
  { metodo: "PLIN", label: "Plin", icon: Smartphone },
  { metodo: "TARJETA", label: "Tarjeta", icon: CreditCard },
  { metodo: "TRANSFERENCIA", label: "Transferencia", icon: Landmark },
]

export const PosPaymentPanel = memo(function PosPaymentPanel({ cajaAbierta = true }: { cajaAbierta?: boolean }) {
  const { paymentPanelRef } = usePosRefs()
  const total = usePosStore((state) => state.total)
  const clearPagos = usePosStore((state) => state.clearPagos)
  const pagosCount = usePosStore((state) => state.pagos.length)
  const [selectedMetodo, setSelectedMetodo] = useState<PosMetodoPago | null>(null)
  const handleSubmitted = useCallback(() => setSelectedMetodo(null), [])
  const handleSelectMetodo = useCallback((metodo: PosMetodoPago) => setSelectedMetodo(metodo), [])

  return (
    <Card ref={paymentPanelRef} tabIndex={-1} aria-label="Panel de pagos POS">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="h-4 w-4" />
          Pagos
        </CardTitle>
        <Button disabled={!pagosCount} size="sm" variant="ghost" onClick={clearPagos}>Limpiar</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border bg-primary/5 p-3">
          <p className="text-xs text-muted-foreground">Total a cobrar</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(total)}</p>
        </div>

        <PosSaleTypeSelector />
        <PosPaymentValidationAlert cajaAbierta={cajaAbierta} />

        <div className="grid grid-cols-2 gap-2">
          {methodButtons.map(({ metodo, label, icon }) => (
            <PosPaymentMethodButton
              key={metodo}
              disabled={!cajaAbierta || total <= 0}
              icon={icon}
              label={label}
              onClick={() => handleSelectMetodo(metodo)}
            />
          ))}
        </div>

        {selectedMetodo && <PosPaymentForm metodoInicial={selectedMetodo} onSubmitted={handleSubmitted} />}

        <Separator />
        <PosPaymentList />
        <PosPaymentSummary />
      </CardContent>
    </Card>
  )
})
