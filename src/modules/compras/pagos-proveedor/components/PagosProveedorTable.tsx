import { Eye, MoreHorizontal, XCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { PagoProveedorEstadoBadge } from "@/modules/compras/pagos-proveedor/components/PagoProveedorEstadoBadge"
import type { PagoProveedor } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"

function money(value?: number | string | null) { return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(value ?? 0)) }

type Props = { pagos: PagoProveedor[]; onAnular: (pago: PagoProveedor) => void }

export function PagosProveedorTable({ pagos, onAnular }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead><TableHead>Proveedor</TableHead><TableHead>Cuenta</TableHead><TableHead>Metodo</TableHead><TableHead className="text-right">Monto</TableHead><TableHead>Estado</TableHead><TableHead>Usuario</TableHead><TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagos.map((pago) => (
            <TableRow key={pago.id}>
              <TableCell>{pago.fecha_pago}</TableCell>
              <TableCell className="font-medium">{pago.proveedor?.razon_social ?? "-"}</TableCell>
              <TableCell>{pago.cuenta_por_pagar?.compra?.numero_documento ?? `CxP #${pago.cuenta_por_pagar_id}`}</TableCell>
              <TableCell>{pago.metodo_pago}</TableCell>
              <TableCell className="text-right font-semibold">{money(pago.monto)}</TableCell>
              <TableCell><PagoProveedorEstadoBadge estado={pago.estado} /></TableCell>
              <TableCell>{pago.creado_por?.name ?? "-"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label="Acciones pago proveedor"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link to={`/compras/pagos-proveedor/${pago.id}`}><Eye className="mr-2 h-4 w-4" />Ver detalle</Link></DropdownMenuItem>
                    {pago.estado === "REGISTRADO" ? <DropdownMenuItem className="text-destructive" onClick={() => onAnular(pago)}><XCircle className="mr-2 h-4 w-4" />Anular pago</DropdownMenuItem> : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}