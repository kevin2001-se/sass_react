import { useMutation } from "@tanstack/react-query"

import { sunatConfiguracionService } from "@/modules/configuracion/sunat/services/sunatConfiguracion.service"

export function useProbarGreConfig() {
  return useMutation({
    mutationFn: () => sunatConfiguracionService.probarGre(),
  })
}