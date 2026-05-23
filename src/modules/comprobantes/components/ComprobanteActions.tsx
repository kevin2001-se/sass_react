import { Eye, MoreHorizontal, RefreshCcw, Send, FilePlus2 } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { useComprobanteActions } from "@/modules/comprobantes/hooks/useComprobanteActions"
import type { ComprobanteElectronico } from "@/modules/comprobantes/types/comprobante.types"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"

type Props = {
  comprobante: ComprobanteElectronico
  onNotaCredito?: (comprobante: ComprobanteElectronico) => void
  onNotaDebito?: (comprobante: ComprobanteElectronico) => void
}

export function ComprobanteActions({ comprobante, onNotaCredito, onNotaDebito }: Props) {
  const { reenviar, emitir } = useComprobanteActions()
  const estado = comprobante.estado_sunat
  const canReenviar = estado === "ERROR" || estado === "RECHAZADO" || estado === "PENDIENTE"
  const canEmitir = estado === "PENDIENTE" && comprobante.venta_id
  const canNotas = estado === "ACEPTADO" && (comprobante.tipo_comprobante === "BOLETA" || comprobante.tipo_comprobante === "FACTURA")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={comprobante.id < 0 && comprobante.venta_id ? `/ventas/${comprobante.venta_id}` : `/comprobantes/${comprobante.id}`}><Eye className="mr-2 h-4 w-4" />Ver detalle</Link>
        </DropdownMenuItem>
        {canEmitir ? (
          <DropdownMenuItem onClick={() => emitir.mutate(Number(comprobante.venta_id))}>
            <Send className="mr-2 h-4 w-4" />Enviar SUNAT
          </DropdownMenuItem>
        ) : null}
        {canReenviar ? (
          <DropdownMenuItem onClick={() => reenviar.mutate(comprobante.id)}>
            <RefreshCcw className="mr-2 h-4 w-4" />Reenviar
          </DropdownMenuItem>
        ) : null}
        {canNotas ? (
          <>
            <DropdownMenuItem onClick={() => onNotaCredito?.(comprobante)}>
              <FilePlus2 className="mr-2 h-4 w-4" />Nota credito
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNotaDebito?.(comprobante)}>
              <FilePlus2 className="mr-2 h-4 w-4" />Nota debito
            </DropdownMenuItem>
          </>
        ) : null}
        {estado === "RECHAZADO" || estado === "ERROR" ? (
          <DropdownMenuItem onClick={() => toast.info(comprobante.mensaje_respuesta ?? "Sin mensaje SUNAT.")}>Ver mensaje</DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}