import { api } from "@/shared/services/api"
import type { PosVentaPayload, PosVentaRegistrada } from "@/modules/pos/types/pos.types"

type ResourceResponse<T> = { data: T; success?: boolean; message?: string }

function unwrapVenta(payload: PosVentaRegistrada | ResourceResponse<PosVentaRegistrada>) {
  return "data" in payload ? payload.data : payload
}

export const posVentaService = {
  async registrarVenta(payload: PosVentaPayload, idempotencyKey?: string) {
    const { data } = await api.post<PosVentaRegistrada | ResourceResponse<PosVentaRegistrada>>("/ventas", payload, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    })
    return unwrapVenta(data)
  },
}