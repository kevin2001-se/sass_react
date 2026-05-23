import { useMutation, useQuery } from "@tanstack/react-query"

import { tiendaService } from "@/shared/services/tienda.service"

export function useMisTiendas(enabled = true) {
  return useQuery({
    queryKey: ["tiendas", "mis-tiendas"],
    queryFn: () => tiendaService.getMisTiendas(),
    enabled,
  })
}

export function useSeleccionarTienda() {
  return useMutation({
    mutationFn: (tiendaId: number) => tiendaService.seleccionarTienda(tiendaId),
  })
}
