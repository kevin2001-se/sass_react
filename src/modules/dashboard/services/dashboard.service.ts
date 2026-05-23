import { api } from "@/shared/services/api"
import type { DashboardResumen } from "@/modules/dashboard/types/dashboard.types"

type DashboardResponse = DashboardResumen | {
  data: DashboardResumen
}

export const dashboardService = {
  async getResumen() {
    const { data } = await api.get<DashboardResponse>("/dashboard/resumen")
    return "data" in data ? data.data : data
  },
}
