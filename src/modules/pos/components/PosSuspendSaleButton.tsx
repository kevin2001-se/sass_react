import { PauseCircle } from "lucide-react"
import { toast } from "sonner"

import { PosKeyboardHint } from "@/modules/pos/components/PosKeyboardHint"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Button } from "@/shared/components/ui/button"

export function PosSuspendSaleButton() {
  const items = usePosStore((state) => state.items)
  const suspendCurrentSale = usePosStore((state) => state.suspendCurrentSale)

  function handleSuspend() {
    const result = suspendCurrentSale()
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success("Venta suspendida correctamente.")
  }

  return (
    <Button variant="outline" disabled={items.length === 0} title="F9 suspender venta" onClick={handleSuspend}>
      <PauseCircle className="h-4 w-4" />
      Suspender <PosKeyboardHint keys="F9" />
    </Button>
  )
}