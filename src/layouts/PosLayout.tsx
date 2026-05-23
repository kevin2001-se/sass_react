import { Outlet } from "react-router-dom"

export function PosLayout() {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <Outlet />
    </div>
  )
}
