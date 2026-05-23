import { useQuery } from "@tanstack/react-query"

import { sunatConfiguracionService } from "@/modules/configuracion/sunat/services/sunatConfiguracion.service"

export function useSunatConfiguracion() {
  return useQuery({
    queryKey: ["sunat", "configuracion"],
    queryFn: () => sunatConfiguracionService.getConfiguracion(),
  })
}
