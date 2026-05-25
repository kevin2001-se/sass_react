import { Badge } from "@/shared/components/ui/badge"

export function ProveedorStatusBadge({ estado }: { estado: boolean }) {
  return <Badge variant={estado ? "default" : "secondary"}>{estado ? "Activo" : "Inactivo"}</Badge>
}