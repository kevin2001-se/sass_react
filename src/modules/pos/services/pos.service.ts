import { cajaService } from "@/modules/caja/services/caja.service"

export const posService = {
  getCajaAbierta: () => cajaService.getCajaAbierta(),
}

