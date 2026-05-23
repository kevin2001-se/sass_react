import { useQuery } from "@tanstack/react-query"

import { ventaService } from "@/modules/ventas/services/venta.service"
import type { VentaFilters } from "@/modules/ventas/types/venta.types"

export function useVentas(filters: VentaFilters) {
  return useQuery({
    queryKey: ["ventas", filters],
    queryFn: () => ventaService.getVentas(filters),
  })
}
