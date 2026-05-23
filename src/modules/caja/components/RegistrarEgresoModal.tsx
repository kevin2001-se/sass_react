import { MovimientoCajaModal } from "@/modules/caja/components/MovimientoCajaModal"

export function RegistrarEgresoModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return <MovimientoCajaModal mode="egreso" open={open} onOpenChange={onOpenChange} />
}
