import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { notaElectronicaService } from "@/modules/comprobantes/services/notaElectronica.service"
import type { NotaElectronicaPayload } from "@/modules/comprobantes/types/comprobante.types"

export function useNotasElectronicas(tipo?: "NOTA_CREDITO" | "NOTA_DEBITO") {
  return useQuery({ queryKey: ["notas-electronicas", tipo], queryFn: () => notaElectronicaService.getNotas(tipo) })
}

export function useNotaElectronicaMutations(tipo: "NOTA_CREDITO" | "NOTA_DEBITO") {
  const queryClient = useQueryClient()
  const mutationFn = tipo === "NOTA_CREDITO" ? notaElectronicaService.crearCredito : notaElectronicaService.crearDebito
  return useMutation({
    mutationFn: (payload: NotaElectronicaPayload) => mutationFn(payload),
    onSuccess: () => {
      toast.success("Nota registrada correctamente.")
      queryClient.invalidateQueries({ queryKey: ["notas-electronicas"] })
      queryClient.invalidateQueries({ queryKey: ["comprobantes"] })
    },
    onError: () => toast.error("No se pudo registrar la nota."),
  })
}