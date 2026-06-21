import { useQuery } from "@tanstack/react-query"
import { pagoProveedorService } from "@/modules/compras/pagos-proveedor/services/pagoProveedor.service"
import type { PagoProveedorFilters } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"

export function usePagosProveedor(filters: PagoProveedorFilters) {
  return useQuery({ queryKey: ["pagos-proveedor", filters], queryFn: () => pagoProveedorService.list(filters) })
}