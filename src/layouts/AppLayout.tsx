import { Outlet } from "react-router-dom"

import { AppBreadcrumb } from "@/shared/components/layout/AppBreadcrumb"
import { AppHeader } from "@/shared/components/layout/AppHeader"
import { AppSidebar } from "@/shared/components/layout/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 space-y-5 bg-muted/30 p-4 md:p-6">
          <AppBreadcrumb />
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
