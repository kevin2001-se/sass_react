import { useQuery } from "@tanstack/react-query"

import { ventaService } from "@/modules/ventas/services/venta.service"

export function useVenta(id?: number) {
  return useQuery({
    queryKey: ["ventas", id],
    queryFn: () => ventaService.getVenta(Number(id)),
    enabled: Boolean(id),
  })
}
