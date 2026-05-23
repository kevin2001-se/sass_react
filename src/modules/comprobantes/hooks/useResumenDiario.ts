import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { resumenDiarioService } from "@/modules/comprobantes/services/resumenDiario.service"
import type { ResumenDiarioPayload } from "@/modules/comprobantes/types/comprobante.types"
import { downloadBlob } from "@/modules/pos/utils/downloadBlob"

export function useResumenDiario() {
  return useQuery({ queryKey: ["resumenes-diarios"], queryFn: resumenDiarioService.getResumenes })
}

export function useResumenDiarioActions() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["resumenes-diarios"] })
  const onError = () => toast.error("No se pudo completar la accion.")
  return {
    generar: useMutation({ mutationFn: (payload: ResumenDiarioPayload) => resumenDiarioService.generar(payload), onSuccess: () => { toast.success("Resumen generado."); invalidate() }, onError }),
    enviar: useMutation({ mutationFn: (id: number) => resumenDiarioService.enviar(id), onSuccess: () => { toast.success("Resumen enviado."); invalidate() }, onError }),
    consultar: useMutation({ mutationFn: (id: number) => resumenDiarioService.consultarTicket(id), onSuccess: () => { toast.success("Ticket consultado."); invalidate() }, onError }),
    reenviar: useMutation({ mutationFn: (id: number) => resumenDiarioService.reenviar(id), onSuccess: () => { toast.success("Resumen reenviado."); invalidate() }, onError }),
    descargarXml: async (id: number, name: string) => downloadBlob(await resumenDiarioService.xml(id), `${name}.xml`),
    descargarCdr: async (id: number, name: string) => downloadBlob(await resumenDiarioService.cdr(id), `R-${name}.zip`),
  }
}