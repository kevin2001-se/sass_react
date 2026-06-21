import { Badge } from "@/shared/components/ui/badge"

export function ResumenDiarioAccionBadge({ accion }: { accion?: string | null }) {
  const value = accion || "ALTA"

  if (value === "BAJA") {
    return <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">BAJA</Badge>
  }

  return <Badge variant="secondary">ALTA</Badge>
}