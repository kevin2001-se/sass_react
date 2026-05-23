import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { guiaRemisionService } from "@/modules/comprobantes/services/guiaRemision.service"
import type { GuiaRemisionPayload } from "@/modules/comprobantes/types/comprobante.types"

export function useGuiasRemision() {
  return useQuery({ queryKey: ["guias-remision"], queryFn: guiaRemisionService.getGuias })
}

export function useGuiaRemisionActions() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["guias-remision"] })
  const onError = () => toast.error("No se pudo completar la accion.")
  return {
    crear: useMutation({ mutationFn: (payload: GuiaRemisionPayload) => guiaRemisionService.crear(payload), onSuccess: () => { toast.success("Guia creada."); invalidate() }, onError }),
    enviar: useMutation({ mutationFn: (id: number) => guiaRemisionService.enviar(id), onSuccess: () => { toast.success("Guia enviada."); invalidate() }, onError }),
    reenviar: useMutation({ mutationFn: (id: number) => guiaRemisionService.reenviar(id), onSuccess: () => { toast.success("Guia reenviada."); invalidate() }, onError }),
    anular: useMutation({ mutationFn: ({ id, motivo }: { id: number; motivo: string }) => guiaRemisionService.anular(id, motivo), onSuccess: () => { toast.success("Guia anulada."); invalidate() }, onError }),
  }
}