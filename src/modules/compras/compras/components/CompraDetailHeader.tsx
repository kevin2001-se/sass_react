import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { CompraEstadoBadge } from "@/modules/compras/compras/components/CompraEstadoBadge"
import type { Compra } from "@/modules/compras/compras/types/compra.types"

export function CompraDetailHeader({ compra }: { compra: Compra }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><CardTitle>{compra.numero_documento}</CardTitle><p className="text-sm text-muted-foreground">Compra registrada el {compra.fecha_emision}</p></div>
        <CompraEstadoBadge estado={compra.estado} />
      </CardHeader>
      <CardContent className="grid gap-3 text-sm md:grid-cols-3">
        <div><span className="text-muted-foreground">Proveedor</span><p className="font-medium">{compra.proveedor?.razon_social ?? "-"}</p></div>
        <div><span className="text-muted-foreground">Tipo pago</span><p className="font-medium">{compra.tipo_pago}</p></div>
        <div><span className="text-muted-foreground">Tienda</span><p className="font-medium">{compra.tienda?.nombre ?? "-"}</p></div>
        <div><span className="text-muted-foreground">Usuario</span><p className="font-medium">{compra.user?.name ?? "-"}</p></div>
        <div><span className="text-muted-foreground">Vencimiento</span><p className="font-medium">{compra.fecha_vencimiento ?? "-"}</p></div>
        <div><span className="text-muted-foreground">Observacion</span><p className="font-medium">{compra.observacion ?? "-"}</p></div>
      </CardContent>
    </Card>
  )
}
