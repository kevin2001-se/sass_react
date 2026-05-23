import { Badge } from "@/shared/components/ui/badge"
import { isLotExpired, isLotNearExpiration } from "@/modules/pos/utils/posCalculations"

export function PosExpirationBadge({ fecha }: { fecha?: string | null }) {
  if (!fecha) return <Badge variant="outline">Sin vencimiento</Badge>
  if (isLotExpired(fecha)) return <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive">Vencido</Badge>
  if (isLotNearExpiration(fecha)) return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Por vencer</Badge>
  return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Vigente</Badge>
}
