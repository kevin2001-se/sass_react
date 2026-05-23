import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

export type InfoItem = {
  label: string
  value?: string | number | null
}

export function GuiaRemisionInfoCard({ title, items }: { title: string; items: InfoItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs font-medium uppercase text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-sm font-medium">{item.value ?? "-"}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
