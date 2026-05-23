import { CheckCircle2 } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { PosKeyboardHint } from "@/modules/pos/components/PosKeyboardHint"
import { PosSaleSuccessModal } from "@/modules/pos/components/PosSaleSuccessModal"
import { posDocumentoService } from "@/modules/pos/services/posDocumento.service"
import { openPrintableBlob } from "@/modules/pos/utils/downloadBlob"
import { usePosRefs } from "@/modules/pos/context/PosRefsContext"
import { useRegistrarVentaPos } from "@/modules/pos/hooks/useRegistrarVentaPos"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Button } from "@/shared/components/ui/button"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"

export function PosRegisterSaleButton({ cajaAbierta }: { cajaAbierta: boolean }) {
  const { registerButtonRef, searchInputRef } = usePosRefs()
  const registrarVenta = useRegistrarVentaPos()
  const buildVentaPayload = usePosStore((state) => state.buildVentaPayload)
  const validateBeforeRegister = usePosStore((state) => state.validateBeforeRegister)
  const resetAfterSale = usePosStore((state) => state.resetAfterSale)
  const setLastSale = usePosStore((state) => state.setLastSale)
  const lastSale = usePosStore((state) => state.lastSale)
  const items = usePosStore((state) => state.items)
  const puedeCobrar = usePosStore((state) => state.puedeCobrar)
  const [successOpen, setSuccessOpen] = useState(false)
  const submittingRef = useRef(false)


  async function tryPrintTicket(sale: NonNullable<typeof lastSale>) {
    try {
      await posDocumentoService.generarTicketVenta80(sale.id)
      const blob = await posDocumentoService.descargarTicketVenta80(sale.id)
      if (!openPrintableBlob(blob)) toast.info("El navegador bloqueo la impresion automatica. Usa el boton Imprimir ticket.")
    } catch {
      toast.warning("Venta registrada, pero no se pudo imprimir el ticket.")
    }
  }
  async function handleRegister() {
    if (submittingRef.current || registrarVenta.isPending) return
    const validation = validateBeforeRegister(cajaAbierta)
    if (!validation.ok) {
      toast.error(validation.message)
      return
    }

    try {
      submittingRef.current = true
      const sale = await registrarVenta.mutateAsync(buildVentaPayload())
      setLastSale(sale)
      void tryPrintTicket(sale)
      resetAfterSale()
      toast.success("Venta registrada correctamente.")
      setSuccessOpen(true)
    } catch (error) {
      const validationErrors = getLaravelValidationErrors(error)
      const firstError = Object.values(validationErrors)[0]?.[0]
      const message = firstError || getLaravelErrorMessage(error, "No se pudo registrar la venta.")

      if (/stock/i.test(message)) toast.error("Stock insuficiente. Actualiza la busqueda del producto.")
      else if (/caja/i.test(message)) toast.error("No hay caja abierta. Apertura caja antes de vender.")
      else toast.error(message)
    } finally {
      submittingRef.current = false
    }
  }

  return (
    <>
      <Button
        ref={registerButtonRef}
        className="h-12 text-base font-semibold"
        disabled={registrarVenta.isPending || !cajaAbierta || items.length === 0 || !puedeCobrar}
        title={!cajaAbierta ? "No hay caja abierta" : !puedeCobrar ? "Completa el pago para registrar" : "F10 registrar venta"}
        type="button"
        variant="secondary"
        onClick={handleRegister}
      >
        <CheckCircle2 className="h-5 w-5" />
        {registrarVenta.isPending ? "Registrando..." : "Registrar venta"}
        <PosKeyboardHint keys="F10" />
      </Button>
      <PosSaleSuccessModal
        open={successOpen}
        sale={lastSale}
        onOpenChange={(open) => {
          setSuccessOpen(open)
          if (!open) window.setTimeout(() => searchInputRef.current?.focus(), 80)
        }}
        onNewSale={() => {
          setSuccessOpen(false)
          setLastSale(null)
          window.setTimeout(() => searchInputRef.current?.focus(), 80)
        }}
      />
    </>
  )
}



