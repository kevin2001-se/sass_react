import { api } from "@/shared/services/api"
import type {
  LaravelResourceResponse,
  SeleccionarTiendaPayload,
  SeleccionarTiendaResponse,
  Tienda,
} from "@/shared/types/auth.types"

function unwrapCollection<T>(payload: T[] | LaravelResourceResponse<T[]>): T[] {
  return Array.isArray(payload) ? payload : payload.data
}

function unwrapTienda(payload: SeleccionarTiendaResponse | { tienda_activa: LaravelResourceResponse<Tienda> }) {
  const tiendaActiva = payload.tienda_activa

  if (!tiendaActiva) {
    return payload as SeleccionarTiendaResponse
  }

  return {
    ...payload,
    tienda_activa: "data" in tiendaActiva ? tiendaActiva.data : tiendaActiva,
  }
}

export const tiendaService = {
  async getMisTiendas() {
    const { data } = await api.get<Tienda[] | LaravelResourceResponse<Tienda[]>>("/tiendas/mis-tiendas")
    return unwrapCollection(data)
  },

  async seleccionarTienda(tiendaId: number) {
    const payload: SeleccionarTiendaPayload = {
      tienda_id: tiendaId,
    }

    const { data } = await api.post<SeleccionarTiendaResponse | { tienda_activa: LaravelResourceResponse<Tienda> }>(
      "/tiendas/seleccionar",
      payload,
    )
    return unwrapTienda(data)
  },
}
