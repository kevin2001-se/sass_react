import { Building2 } from "lucide-react"

import { Skeleton } from "@/shared/components/ui/skeleton"

export function AppLoadingPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 p-6">
      <div className="w-full max-w-sm space-y-5 rounded-lg border bg-background p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Botica SaaS</p>
            <p className="text-xs text-muted-foreground">Validando sesión</p>
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
