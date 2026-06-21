import { useMutation, useQueryClient } from "@tanstack/react-query"
import { parametroService } from "@/modules/configuracion/parametros/services/parametro.service"

export function useActualizarParametros() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: parametroService.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["configuracion", "parametros"] }),
  })
}