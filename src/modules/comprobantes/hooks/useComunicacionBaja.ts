import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { comunicacionBajaService } from "@/modules/comprobantes/services/comunicacionBaja.service"
import type { ComunicacionBajaPayload } from "@/modules/comprobantes/types/comprobante.types"
import { downloadBlob } from "@/modules/pos/utils/downloadBlob"

export function useComunicacionBaja() {
  return useQuery({ queryKey: ["comunicaciones-baja"], queryFn: comunicacionBajaService.getBajas })
}

export function useComunicacionBajaActions() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["comunicaciones-baja"] })
  const onError = () => toast.error("No se pudo completar la accion.")
  return {
    generar: useMutation({ mutationFn: (payload: ComunicacionBajaPayload) => comunicacionBajaService.generar(payload), onSuccess: () => { toast.success("Comunicacion de baja generada."); invalidate() }, onError }),
    enviar: useMutation({ mutationFn: (id: number) => comunicacionBajaService.enviar(id), onSuccess: () => { toast.success("Comunicacion enviada."); invalidate() }, onError }),
    consultar: useMutation({ mutationFn: (id: number) => comunicacionBajaService.consultarTicket(id), onSuccess: () => { toast.success("Ticket consultado."); invalidate() }, onError }),
    reenviar: useMutation({ mutationFn: (id: number) => comunicacionBajaService.reenviar(id), onSuccess: () => { toast.success("Comunicacion reenviada."); invalidate() }, onError }),
    descargarXml: async (id: number, name: string) => downloadBlob(await comunicacionBajaService.xml(id), `${name}.xml`),
    descargarCdr: async (id: number, name: string) => downloadBlob(await comunicacionBajaService.cdr(id), `R-${name}.zip`),
  }
}