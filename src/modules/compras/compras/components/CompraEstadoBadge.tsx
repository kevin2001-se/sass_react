import { Badge } from "@/shared/components/ui/badge"
import type { CompraEstado } from "@/modules/compras/compras/types/compra.types"

export function CompraEstadoBadge({ estado }: { estado: CompraEstado | string }) {
  if (estado === "ANULADA") return <Badge className="bg-red-50 text-red-700 hover:bg-red-50">ANULADA</Badge>
  return <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">REGISTRADA</Badge>
}

