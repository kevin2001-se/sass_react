import { useQuery } from "@tanstack/react-query"

import { guiaRemisionService } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"

export function useGuiaVentaData(ventaId?: number | null) {
  return useQuery({
    queryKey: ["guia-venta-data", ventaId],
    queryFn: () => guiaRemisionService.getGuiaVentaData(ventaId as number),
    enabled: Boolean(ventaId),
  })
}
