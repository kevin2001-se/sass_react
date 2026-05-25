import { Eye, FileText, MoreHorizontal, XCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { CompraEstadoBadge } from "@/modules/compras/compras/components/CompraEstadoBadge"
import type { Compra } from "@/modules/compras/compras/types/compra.types"
import { compraService } from "@/modules/compras/compras/services/compra.service"
import { openBlob } from "@/shared/utils/blob"
import { getLaravelErrorMessage } from "@/shared/services/api"

type ComprasTableProps = { compras: Compra[]; onAnular: (compra: Compra) => void }
function money(value: number | string) { return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(value ?? 0)) }

export function ComprasTable({ compras, onAnular }: ComprasTableProps) {
  async function openPdf(compra: Compra) {
    try {
      if (!compra.tiene_pdf) await compraService.generarPdf(compra.id)
      const blob = await compraService.descargarPdf(compra.id)
      if (!openBlob(blob)) toast.info("PDF generado. Permite ventanas emergentes para abrirlo.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo abrir el PDF."))
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead><TableHead>Documento</TableHead><TableHead>Proveedor</TableHead><TableHead>Tipo pago</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Estado</TableHead><TableHead>Usuario</TableHead><TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compras.map((compra) => (
            <TableRow key={compra.id}>
              <TableCell>{compra.fecha_emision}</TableCell>
              <TableCell className="font-medium">{compra.numero_documento}</TableCell>
              <TableCell>{compra.proveedor?.razon_social ?? "-"}</TableCell>
              <TableCell>{compra.tipo_pago}</TableCell>
              <TableCell className="text-right font-semibold">{money(compra.total)}</TableCell>
              <TableCell><CompraEstadoBadge estado={compra.estado} /></TableCell>
              <TableCell>{compra.user?.name ?? "-"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link to={`/compras/${compra.id}`}><Eye className="mr-2 h-4 w-4" />Ver detalle</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openPdf(compra)}><FileText className="mr-2 h-4 w-4" />Ver PDF</DropdownMenuItem>
                    {compra.estado === "REGISTRADA" && <DropdownMenuItem className="text-destructive" onClick={() => onAnular(compra)}><XCircle className="mr-2 h-4 w-4" />Anular</DropdownMenuItem>}
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
