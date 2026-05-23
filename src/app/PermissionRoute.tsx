import { Navigate, Outlet } from "react-router-dom"

import { useAuthStore } from "@/shared/stores/auth.store"

export function PermissionRoute({ permission }: { permission?: string }) {
  const hasPermission = useAuthStore((state) => state.hasPermission)

  if (!hasPermission(permission)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
