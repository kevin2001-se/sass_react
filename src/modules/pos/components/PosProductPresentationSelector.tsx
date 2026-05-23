import { PosPresentationCard } from "@/modules/pos/components/PosPresentationCard"
import type { PosProductoPresentacion, PosProductoSearchItem } from "@/modules/pos/types/posProducto.types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

export function PosProductPresentationSelector({
  open,
  producto,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  producto: PosProductoSearchItem | null
  onOpenChange: (open: boolean) => void
  onSelect: (presentacion: PosProductoPresentacion) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seleccionar presentacion</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 md:grid-cols-2">
          {producto?.presentaciones.map((presentacion) => (
            <PosPresentationCard
              key={presentacion.id}
              presentacion={presentacion}
              selected={false}
              onSelect={() => onSelect(presentacion)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
