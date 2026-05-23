import { ArrowLeft, Pencil } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { ProductoStatusBadge } from "@/modules/productos/components/ProductoStatusBadge"
import { useProducto } from "@/modules/productos/hooks/useProducto"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

export function ProductoDetailPage() {
  const params = useParams()
  const productoId = Number(params.id)
  const productoQuery = useProducto(productoId)
  const producto = productoQuery.data

  if (productoQuery.isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!producto) {
    return <div className="text-sm text-muted-foreground">Producto no encontrado.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Button asChild size="sm" variant="ghost">
            <Link to="/productos">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">{producto.nombre}</h1>
          <p className="text-sm text-muted-foreground">{producto.codigo_interno}</p>
        </div>
        <Button asChild>
          <Link to={`/productos/${producto.id}/editar`}>
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informacion</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Detail label="Categoria" value={producto.categoria?.nombre} />
            <Detail label="Marca" value={producto.marca?.nombre} />
            <Detail label="Laboratorio" value={producto.laboratorio?.nombre} />
            <Detail label="Principios activos" value={producto.principios_activos?.map((item) => item.nombre).join(", ") || producto.principio_activo?.nombre} />
            <Detail label="Concentracion" value={producto.concentracion} />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estado</span>
              <ProductoStatusBadge estado={producto.estado} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuracion</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Detail label="Requiere receta" value={producto.requiere_receta ? "Si" : "No"} />
            <Detail label="Maneja lote" value={producto.maneja_lote ? "Si" : "No"} />
            <Detail label="Maneja vencimiento" value={producto.maneja_vencimiento ? "Si" : "No"} />
            <Detail label="Afectacion IGV" value={producto.afectacion_igv ? `${producto.afectacion_igv.abreviatura} - ${producto.afectacion_igv.descripcion}` : (producto.afecto_igv ? "IGV" : "EXO")} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Presentaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Codigo barra</TableHead>
                <TableHead>Factor</TableHead>
                <TableHead>Precio venta</TableHead>
                <TableHead>Principal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {producto.presentaciones?.map((presentacion) => (
                <TableRow key={presentacion.id}>
                  <TableCell>{presentacion.nombre}</TableCell>
                  <TableCell>{presentacion.unidad_medida?.nombre ?? "-"}</TableCell>
                  <TableCell>{presentacion.codigo_barra ?? "-"}</TableCell>
                  <TableCell>{presentacion.factor_conversion}</TableCell>
                  <TableCell>S/ {Number(presentacion.precio_venta).toFixed(2)}</TableCell>
                  <TableCell>{presentacion.es_principal ? "Si" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "-"}</span>
    </div>
  )
}

