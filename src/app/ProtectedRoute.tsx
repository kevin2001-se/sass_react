import { Navigate, Outlet, useLocation } from "react-router-dom"

import { AppLoadingPage } from "@/shared/pages/AppLoadingPage"
import { useAuthStore } from "@/shared/stores/auth.store"

export function ProtectedRoute() {
  const { isAuthenticated, tiendaActiva, isBootstrapped, isLoading } = useAuthStore()
  const location = useLocation()

  if (!isBootstrapped || isLoading) {
    return <AppLoadingPage />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!tiendaActiva) {
    return <Navigate to="/seleccionar-tienda" replace />
  }

  return <Outlet />
}
