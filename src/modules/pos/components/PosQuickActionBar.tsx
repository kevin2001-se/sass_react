import { CreditCard, PauseCircle, Search, User, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { PosKeyboardHint } from "@/modules/pos/components/PosKeyboardHint"
import { usePosRefs } from "@/modules/pos/context/PosRefsContext"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Button } from "@/shared/components/ui/button"

export function PosQuickActionBar({ onOpenSuspended, onTryRegister }: { onOpenSuspended: () => void; onTryRegister: () => void }) {
  const { searchInputRef, paymentPanelRef, customerButtonRef } = usePosRefs()
  const suspendCurrentSale = usePosStore((state) => state.suspendCurrentSale)
  const items = usePosStore((state) => state.items)

  function suspend() {
    const result = suspendCurrentSale()
    if (!result.ok) toast.error(result.message)
    else toast.success("Venta suspendida correctamente.")
  }

  return (
    <div className="grid grid-cols-5 gap-2 rounded-md border bg-background p-2 shadow-sm lg:static fixed bottom-0 left-0 right-0 z-30 lg:shadow-none">
      <Button variant="outline" onClick={() => searchInputRef.current?.focus()} title="F2 buscar producto"><Search className="h-4 w-4" /><span className="hidden sm:inline">Buscar</span><PosKeyboardHint keys="F2" /></Button>
      <Button variant="outline" onClick={() => customerButtonRef.current?.click()} title="F6 cliente"><User className="h-4 w-4" /><span className="hidden sm:inline">Cliente</span><PosKeyboardHint keys="F6" /></Button>
      <Button variant="outline" onClick={() => paymentPanelRef.current?.focus()} title="F4 cobrar"><CreditCard className="h-4 w-4" /><span className="hidden sm:inline">Cobrar</span><PosKeyboardHint keys="F4" /></Button>
      <Button variant="outline" disabled={items.length === 0} onClick={suspend} title="F9 suspender"><PauseCircle className="h-4 w-4" /><span className="hidden sm:inline">Suspender</span><PosKeyboardHint keys="F9" /></Button>
      <Button onClick={onTryRegister} title="F10 registrar venta"><CheckCircle2 className="h-4 w-4" /><span className="hidden sm:inline">Registrar</span><PosKeyboardHint keys="F10" /></Button>
      <Button className="col-span-5 lg:hidden" variant="secondary" onClick={onOpenSuspended}>Ver suspendidas <PosKeyboardHint keys="F8" /></Button>
    </div>
  )
}