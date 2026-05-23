import { useMutation, useQueryClient } from "@tanstack/react-query"

import { catalogosService } from "@/modules/catalogos/services/catalogos.service"
import type { CatalogoConfig, CatalogoPayload } from "@/modules/catalogos/types/catalogo.types"

export function useCreateCatalogo(config: CatalogoConfig) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CatalogoPayload) => catalogosService.create(config, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["catalogos", config.kind] }),
  })
}

export function useUpdateCatalogo(config: CatalogoConfig) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CatalogoPayload }) =>
      catalogosService.update(config, id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["catalogos", config.kind] }),
  })
}

export function useDeleteCatalogo(config: CatalogoConfig) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => catalogosService.delete(config, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["catalogos", config.kind] }),
  })
}
