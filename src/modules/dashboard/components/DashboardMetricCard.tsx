import type { LucideIcon } from "lucide-react"

import { Badge } from "@/shared/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { cn } from "@/shared/utils/cn"

type DashboardMetricCardProps = {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  badge?: string
  tone?: "default" | "warning" | "success"
}

const toneClasses = {
  default: "bg-indigo-50 text-indigo-700",
  warning: "bg-amber-50 text-amber-700",
  success: "bg-emerald-50 text-emerald-700",
}

export function DashboardMetricCard({
  title,
  value,
  description,
  icon: Icon,
  badge,
  tone = "default",
}: DashboardMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("rounded-md p-2", toneClasses[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-normal">{value}</div>
        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">{description}</span>
          {badge && (
            <Badge variant="outline" className="font-normal">
              {badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
