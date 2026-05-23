import { useQuery } from "@tanstack/react-query"

import { posService } from "@/modules/pos/services/pos.service"

export function useCajaAbiertaForPos() {
  return useQuery({
    queryKey: ["pos", "caja-abierta"],
    queryFn: () => posService.getCajaAbierta(),
    retry: false,
  })
}

