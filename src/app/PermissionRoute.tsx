import { Navigate, Outlet } from "react-router-dom"

import { useAuthStore } from "@/shared/stores/auth.store"

type PermissionRouteProps = {
  permission?: string
  permissions?: string[]
}

export function PermissionRoute({ permission, permissions }: PermissionRouteProps) {
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const allowed = permissions?.length ? hasAnyPermission(permissions) : hasPermission(permission)

  if (!allowed) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}