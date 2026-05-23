import { useQuery } from "@tanstack/react-query"

import { dashboardService } from "@/modules/dashboard/services/dashboard.service"

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard", "resumen"],
    queryFn: () => dashboardService.getResumen(),
  })
}
