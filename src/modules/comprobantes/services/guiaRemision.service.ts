import { api } from "@/shared/services/api"
import type { GuiaRemision, GuiaRemisionPayload, PaginatedResponse } from "@/modules/comprobantes/types/comprobante.types"

export const guiaRemisionService = {
  async getGuias() {
    const { data } = await api.get<PaginatedResponse<GuiaRemision>>("/sunat/guias-remision")
    return data
  },
  async crear(payload: GuiaRemisionPayload) {
    const { data } = await api.post("/sunat/guias-remision", payload)
    return data
  },
  async crearDesdeVenta(ventaId: number, payload: GuiaRemisionPayload) {
    const { data } = await api.post(`/sunat/guias-remision/desde-venta/${ventaId}`, payload)
    return data
  },
  async enviar(id: number) {
    const { data } = await api.post(`/sunat/guias-remision/${id}/enviar`)
    return data
  },
  async reenviar(id: number) {
    const { data } = await api.post(`/sunat/guias-remision/${id}/reenviar`)
    return data
  },
  async anular(id: number, motivo: string) {
    const { data } = await api.post(`/sunat/guias-remision/${id}/anular`, { motivo })
    return data
  },
}