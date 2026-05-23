import { PosLotCard } from "@/modules/pos/components/PosLotCard"
import type { PosProductoLote, PosProductoSearchItem } from "@/modules/pos/types/posProducto.types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

export function PosLotSelector({
  open,
  producto,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  producto: PosProductoSearchItem | null
  onOpenChange: (open: boolean) => void
  onSelect: (lote: PosProductoLote) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seleccionar lote</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {producto?.lotes.map((lote) => (
            <PosLotCard key={lote.id} lote={lote} selected={false} onSelect={() => onSelect(lote)} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
