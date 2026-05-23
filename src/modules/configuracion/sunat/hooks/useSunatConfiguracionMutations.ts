import { useMutation, useQueryClient } from "@tanstack/react-query"

import { sunatConfiguracionService } from "@/modules/configuracion/sunat/services/sunatConfiguracion.service"
import type { SunatConfiguracionFormValues } from "@/modules/configuracion/sunat/types/sunatConfiguracion.types"

export function useCreateSunatConfiguracion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: SunatConfiguracionFormValues) => sunatConfiguracionService.createConfiguracion(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sunat", "configuracion"] }),
  })
}

export function useUpdateSunatConfiguracion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: SunatConfiguracionFormValues }) => sunatConfiguracionService.updateConfiguracion(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sunat", "configuracion"] }),
  })
}

export function useDeleteSunatConfiguracion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => sunatConfiguracionService.deleteConfiguracion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sunat", "configuracion"] }),
  })
}
