import { Link, useLocation } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/components/ui/breadcrumb"

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  productos: "Productos",
  inventario: "Inventario",
  ventas: "Ventas POS",
  caja: "Caja",
  compras: "Compras",
  sunat: "SUNAT",
  reportes: "Reportes",
  configuracion: "Configuración",
}

export function AppBreadcrumb() {
  const location = useLocation()
  const parts = location.pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild><Link to="/dashboard">Inicio</Link></BreadcrumbLink>
        </BreadcrumbItem>
        {parts.map((part, index) => (
          <div className="contents" key={part}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === parts.length - 1 ? <BreadcrumbPage>{labels[part] ?? part}</BreadcrumbPage> : <BreadcrumbLink>{labels[part] ?? part}</BreadcrumbLink>}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
