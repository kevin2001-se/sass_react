import { Link } from "react-router-dom"
import { BarChart3, Boxes, CreditCard, LineChart, ShoppingCart, Truck } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

const reportes = [
  { title: "Ventas", description: "Resumen, metodos de pago, productos mas vendidos y detalle.", href: "/reportes/ventas", icon: ShoppingCart },
  { title: "Compras", description: "Resumen de compras, ranking de productos y detalle.", href: "/reportes/compras", icon: Truck },
  { title: "Inventario", description: "Stock, valorizacion, bajo stock, lotes y kardex.", href: "/reportes/inventario", icon: Boxes },
  { title: "Caja", description: "Ingresos, egresos, metodos de pago y cierres.", href: "/reportes/caja", icon: CreditCard },
  { title: "Financiero", description: "Flujo, cuentas por cobrar y cuentas por pagar.", href: "/reportes/financiero", icon: LineChart },
]

export function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
        <p className="text-sm text-muted-foreground">Consulta informacion operativa y financiera de la tienda activa.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportes.map((reporte) => {
          const Icon = reporte.icon
          return (
            <Card key={reporte.href}>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{reporte.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{reporte.description}</p>
                <Button asChild variant="outline">
                  <Link to={reporte.href}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Abrir reporte
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
