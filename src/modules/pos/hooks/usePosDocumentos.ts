import { useMutation } from "@tanstack/react-query"

import { posDocumentoService } from "@/modules/pos/services/posDocumento.service"

export function useGenerarTicket80() {
  return useMutation({ mutationFn: (id: number) => posDocumentoService.generarTicket80(id) })
}

export function useGenerarTicket58() {
  return useMutation({ mutationFn: (id: number) => posDocumentoService.generarTicket58(id) })
}

export function useGenerarPdfA4() {
  return useMutation({ mutationFn: (id: number) => posDocumentoService.generarPdfA4(id) })
}

export function useGenerarFormatos() {
  return useMutation({ mutationFn: (id: number) => posDocumentoService.generarFormatos(id) })
}
