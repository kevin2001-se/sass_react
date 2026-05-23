import axios from "axios"

import type {
  AperturarCajaPayload,
  ArqueoCaja,
  Caja,
  CajaFilters,
  CajaMovimiento,
  CajaMovimientoFilters,
  CajaPaginated,
  CerrarCajaPayload,
  CerrarCajaResponse,
  RegistrarMovimientoCajaPayload,
} from "@/modules/caja/types/caja.types"
import { api } from "@/shared/services/api"

type ResourceResponse<T> = T | { data: T }

function unwrapResource<T>(payload: ResourceResponse<T>) {
  return "data" in (payload as { data: T }) ? (payload as { data: T }).data : payload as T
}

export const cajaService = {
  async getCajas(filters: CajaFilters = {}) {
    const { data } = await api.get<CajaPaginated<Caja>>("/cajas", {
      params: {
        estado: filters.estado || undefined,
        page: filters.page,
        per_page: filters.per_page ?? 15,
      },
    })
    return data
  },

  async getCaja(id: number) {
    const { data } = await api.get<ResourceResponse<Caja>>(`/cajas/${id}`)
    return unwrapResource(data)
  },

  async getCajaAbierta() {
    try {
      const { data } = await api.get<ResourceResponse<Caja>>("/cajas/abierta")
      return unwrapResource(data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  async aperturar(payload: AperturarCajaPayload) {
    const { data } = await api.post<ResourceResponse<Caja>>("/cajas/aperturar", payload)
    return unwrapResource(data)
  },

  async cerrar(id: number, payload: CerrarCajaPayload) {
    const { data } = await api.post<ResourceResponse<CerrarCajaResponse>>(`/cajas/${id}/cerrar`, payload)
    return unwrapResource(data)
  },

  async getArqueo(id: number) {
    const { data } = await api.get<ResourceResponse<ArqueoCaja>>(`/cajas/${id}/arqueo`)
    return unwrapResource(data)
  },

  async getMovimientos(filters: CajaMovimientoFilters = {}) {
    const { data } = await api.get<CajaPaginated<CajaMovimiento>>("/caja-movimientos", {
      params: {
        caja_id: filters.caja_id,
        tipo_movimiento: filters.tipo_movimiento || undefined,
        metodo_pago: filters.metodo_pago || undefined,
        page: filters.page,
        per_page: filters.per_page ?? 20,
      },
    })
    return data
  },

  async registrarIngreso(payload: RegistrarMovimientoCajaPayload) {
    const { data } = await api.post<ResourceResponse<CajaMovimiento>>("/caja-movimientos/ingreso", payload)
    return unwrapResource(data)
  },

  async registrarEgreso(payload: RegistrarMovimientoCajaPayload) {
    const { data } = await api.post<ResourceResponse<CajaMovimiento>>("/caja-movimientos/egreso", payload)
    return unwrapResource(data)
  },
}
