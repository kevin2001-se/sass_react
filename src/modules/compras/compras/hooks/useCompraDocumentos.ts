import { useMutation, useQueryClient } from "@tanstack/react-query"
import { compraService } from "@/modules/compras/compras/services/compra.service"

export function useCompraDocumentos(id: number) {
  const queryClient = useQueryClient()

  const generarPdf = useMutation({
    mutationFn: () => compraService.generarPdf(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] })
      queryClient.invalidateQueries({ queryKey: ["compras", id] })
    },
  })

  const descargarPdf = useMutation({ mutationFn: () => compraService.descargarPdf(id) })

  return { generarPdf, descargarPdf }
}
