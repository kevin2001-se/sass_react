import { useQuery } from "@tanstack/react-query"
import { proveedorService } from "@/modules/compras/proveedores/services/proveedor.service"
import type { ProveedorFilters } from "@/modules/compras/proveedores/types/proveedor.types"

export function useProveedores(filters: ProveedorFilters) {
  return useQuery({ queryKey: ["compras", "proveedores", filters], queryFn: () => proveedorService.list(filters) })
}