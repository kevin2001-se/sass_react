import { api } from "@/shared/services/api"
import type { NotaElectronica, NotaElectronicaPayload, PaginatedResponse } from "@/modules/comprobantes/types/comprobante.types"

export const notaElectronicaService = {
  async getNotas(tipo_nota?: "NOTA_CREDITO" | "NOTA_DEBITO") {
    const { data } = await api.get<PaginatedResponse<NotaElectronica>>("/sunat/notas", { params: tipo_nota ? { tipo_nota } : undefined })
    return data
  },
  async crearCredito(payload: NotaElectronicaPayload) {
    const { data } = await api.post("/sunat/notas/credito", payload)
    return data
  },
  async crearDebito(payload: NotaElectronicaPayload) {
    const { data } = await api.post("/sunat/notas/debito", payload)
    return data
  },
  async reenviar(id: number) {
    const { data } = await api.post(`/sunat/notas/${id}/reenviar`)
    return data
  },
  async anular(id: number, motivo: string) {
    const { data } = await api.post(`/sunat/notas/${id}/anular`, { motivo })
    return data
  },
}