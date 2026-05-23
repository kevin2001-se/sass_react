import { Badge } from "@/shared/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

type PlaceholderPageProps = {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary">Próxima fase</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-normal text-foreground">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          La base del frontend ya tiene navegación, permisos y contexto de tienda.
          Este módulo se conectará a sus endpoints Laravel en la siguiente etapa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vista preparada</CardTitle>
          <CardDescription>
            Aquí se montarán tablas, formularios y acciones del módulo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
            Sin datos cargados todavía.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
