import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { empresaService } from "@/modules/configuracion/empresa/services/empresa.service"

export function useEmpresaConfiguracion() { return useQuery({ queryKey: ["configuracion", "empresa"], queryFn: empresaService.get }) }
export function useUpdateEmpresa() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: empresaService.update, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["configuracion", "empresa"] }) })
}