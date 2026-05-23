import { useMutation, useQuery } from "@tanstack/react-query"

import { posDocumentoService } from "@/modules/pos/services/posDocumento.service"

export function useEmitirSunat() {
  return useMutation({ mutationFn: (ventaId: number) => posDocumentoService.emitirSunat(ventaId) })
}

export function useReenviarSunat() {
  return useMutation({ mutationFn: (comprobanteId: number) => posDocumentoService.reenviarSunat(comprobanteId) })
}

export function usePosComprobante(comprobanteId?: number | null) {
  return useQuery({
    queryKey: ["pos", "comprobante", comprobanteId],
    queryFn: () => posDocumentoService.obtenerComprobante(Number(comprobanteId)),
    enabled: Boolean(comprobanteId),
  })
}
