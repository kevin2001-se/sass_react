import { useEffect } from "react"
import { ListRestart } from "lucide-react"
import { toast } from "sonner"

import { PosSuspendedSaleCard } from "@/modules/pos/components/PosSuspendedSaleCard"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"

type PosSuspendedSalesModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  showTrigger?: boolean
}

export function PosSuspendedSalesModal({ open, onOpenChange, showTrigger = true }: PosSuspendedSalesModalProps) {
  const suspendedSales = usePosStore((state) => state.suspendedSales)
  const items = usePosStore((state) => state.items)
  const getSuspendedSales = usePosStore((state) => state.getSuspendedSales)
  const resumeSuspendedSale = usePosStore((state) => state.resumeSuspendedSale)
  const deleteSuspendedSale = usePosStore((state) => state.deleteSuspendedSale)

  useEffect(() => {
    if (open) getSuspendedSales()
  }, [getSuspendedSales, open])

  function handleResume(id: string) {
    const result = resumeSuspendedSale(id)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success("Venta suspendida recuperada.")
    onOpenChange(false)
  }

  function handleDelete(id: string) {
    const result = deleteSuspendedSale(id)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success("Venta suspendida eliminada.")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => getSuspendedSales()}>
            <ListRestart className="h-4 w-4" />
            Ver suspendidas
            {suspendedSales.length > 0 ? <Badge variant="secondary">{suspendedSales.length}</Badge> : null}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ventas suspendidas</DialogTitle>
          <DialogDescription>Solo se muestran ventas del usuario y tienda activa.</DialogDescription>
        </DialogHeader>
        {suspendedSales.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            No tienes ventas suspendidas en esta tienda.
          </div>
        ) : (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {suspendedSales.map((sale) => (
              <PosSuspendedSaleCard
                key={sale.id}
                sale={sale}
                hasCurrentItems={items.length > 0}
                onResume={handleResume}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}