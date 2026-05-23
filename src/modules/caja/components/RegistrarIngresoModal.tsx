import { MovimientoCajaModal } from "@/modules/caja/components/MovimientoCajaModal"

export function RegistrarIngresoModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return <MovimientoCajaModal mode="ingreso" open={open} onOpenChange={onOpenChange} />
}
