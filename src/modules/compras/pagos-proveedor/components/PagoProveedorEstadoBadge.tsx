import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/utils/cn"
import type { PagoProveedorEstado } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"

export function PagoProveedorEstadoBadge({ estado }: { estado: PagoProveedorEstado }) {
  return <Badge variant="outline" className={cn(estado === "ANULADO" ? "border-slate-200 bg-slate-50 text-slate-600" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>{estado}</Badge>
}