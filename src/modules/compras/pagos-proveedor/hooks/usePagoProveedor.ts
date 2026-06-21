import { useQuery } from "@tanstack/react-query"
import { pagoProveedorService } from "@/modules/compras/pagos-proveedor/services/pagoProveedor.service"

export function usePagoProveedor(id?: number) {
  return useQuery({ queryKey: ["pagos-proveedor", id], queryFn: () => pagoProveedorService.get(Number(id)), enabled: Boolean(id) })
}