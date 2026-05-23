import { Badge } from "@/shared/components/ui/badge"

export function ProductoStatusBadge({ estado }: { estado: boolean }) {
  return (
    <Badge variant={estado ? "secondary" : "outline"}>
      {estado ? "Activo" : "Inactivo"}
    </Badge>
  )
}
