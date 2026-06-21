import { CheckCircle2, ListRestart, Receipt, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { PosKeyboardHint } from "@/modules/pos/components/PosKeyboardHint"
import { PosRegisterSaleButton } from "@/modules/pos/components/PosRegisterSaleButton"
import { PosSaleValidationAlert } from "@/modules/pos/components/PosSaleValidationAlert"
import { PosSuspendSaleButton } from "@/modules/pos/components/PosSuspendSaleButton"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

type PosActionsProps = {
  cajaAbierta: boolean
  onSuspendedOpenChange: (open: boolean) => void
}

export function PosActions({ cajaAbierta, onSuspendedOpenChange }: PosActionsProps) {
  const total = usePosStore((state) => state.total)
  const items = usePosStore((state) => state.items)
  const puedeCobrar = usePosStore((state) => state.puedeCobrar)
  const tipoVenta = usePosStore((state) => state.tipoVenta)
  const pagosCount = usePosStore((state) => state.pagos.length)
  const clearCart = usePosStore((state) => state.clearCart)
  const validateBeforeRegister = usePosStore((state) => state.validateBeforeRegister)
  const getSuspendedSales = usePosStore((state) => state.getSuspendedSales)
  const hasItems = items.length > 0
  const cajaRequerida = tipoVenta === "CONTADO" || pagosCount > 0
  const cajaOk = cajaAbierta || !cajaRequerida

  function handleCobrar() {
    const validation = validateBeforeRegister(cajaAbierta)
    if (!validation.ok) {
      toast.error(validation.message)
      return
    }
    toast.success("Pago completo. Listo para registrar venta.")
  }

  return (
    <div className="grid gap-2">
      {puedeCobrar && (
        <Badge className="w-full justify-center bg-emerald-600 py-1 text-white">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Listo para registrar
        </Badge>
      )}
      <PosSaleValidationAlert cajaAbierta={cajaAbierta} />
      <Button
        className="h-12 text-base font-semibold"
        disabled={!cajaOk || !hasItems || total <= 0}
        title="F4 cobrar"
        onClick={handleCobrar}
      >
        <Receipt className="h-5 w-5" />
        Cobrar <PosKeyboardHint keys="F4" />
      </Button>
      <PosRegisterSaleButton cajaAbierta={cajaAbierta} />
      <div className="grid grid-cols-2 gap-2">
        <PosSuspendSaleButton />
        <Button variant="outline" onClick={() => { getSuspendedSales(); onSuspendedOpenChange(true) }}>
          <ListRestart className="h-4 w-4" />
          Suspendidas <PosKeyboardHint keys="F8" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="col-span-2" variant="outline" disabled={!hasItems} title="Ctrl+L limpiar carrito">
              <Trash2 className="h-4 w-4" />
              Limpiar <PosKeyboardHint keys="Ctrl+L" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Limpiar carrito</AlertDialogTitle>
              <AlertDialogDescription>Esta accion quitara todos los productos y pagos de la venta actual.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={clearCart}>Limpiar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}