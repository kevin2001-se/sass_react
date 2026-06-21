import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

type ReporteMetricCardProps = {
  title: string
  value: string | number
  description?: string
}

export function ReporteMetricCard({ title, value, description }: ReporteMetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </CardContent>
    </Card>
  )
}
