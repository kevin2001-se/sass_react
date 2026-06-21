import { useState } from "react"
import { Ban, Eye, FilePlus2, MoreHorizontal, RefreshCcw, Send } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { SolicitarBajaDialog } from "@/modules/comprobantes/components/SolicitarBajaDialog"
import { useComprobanteActions } from "@/modules/comprobantes/hooks/useComprobanteActions"
import type { ComprobanteElectronico } from "@/modules/comprobantes/types/comprobante.types"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { useAuthStore } from "@/shared/stores/auth.store"

type Props = {
  comprobante: ComprobanteElectronico
  onNotaCredito?: (comprobante: ComprobanteElectronico) => void
  onNotaDebito?: (comprobante: ComprobanteElectronico) => void
}

function isBoletaFactura(comprobante: ComprobanteElectronico) {
  return comprobante.tipo_comprobante === "BOLETA" || comprobante.tipo_comprobante === "FACTURA"
}

function isDocumentoBajaInterna(comprobante: ComprobanteElectronico) {
  return ["BOLETA", "FACTURA", "NOTA_CREDITO", "NOTA_DEBITO"].includes(String(comprobante.tipo_comprobante))
}

function isVentaAnulada(comprobante: ComprobanteElectronico) {
  return comprobante.venta?.estado === "ANULADA"
}

export function ComprobanteActions({ comprobante, onNotaCredito, onNotaDebito }: Props) {
  const [openBaja, setOpenBaja] = useState(false)
  const navigate = useNavigate()
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const { reenviar, emitir, solicitarBaja } = useComprobanteActions(comprobante.id)
  const estado = comprobante.estado_sunat
  const estadoBaja = comprobante.estado_baja ?? "SIN_BAJA"
  const canReenviar = estado === "ERROR" || estado === "RECHAZADO" || estado === "PENDIENTE"
  const canEmitir = estado === "PENDIENTE" && comprobante.venta_id
  const canNotas = estado === "ACEPTADO" && isBoletaFactura(comprobante) && !isVentaAnulada(comprobante)
  const canCrearNc = hasAnyPermission(["notas_credito.crear", "sunat.notas.crear"])
  const canCrearNd = hasAnyPermission(["notas_debito.crear", "sunat.notas.crear"])
  const canSolicitarBaja =
    comprobante.id > 0 &&
    estado === "ACEPTADO" &&
    estadoBaja === "SIN_BAJA" &&
    isDocumentoBajaInterna(comprobante) &&
    hasAnyPermission(["comprobantes.solicitar_baja"])

  function validateNota(tipo: "Credito" | "Debito") {
    if (comprobante.tipo_comprobante === "NOTA_VENTA") {
      toast.info(tipo === "Credito" ? "Las notas de venta se anulan internamente." : "Las notas de venta no generan Nota de Debito.")
      return false
    }
    if (!isBoletaFactura(comprobante)) {
      toast.info(`Solo puedes generar Nota de ${tipo} para boletas o facturas aceptadas por SUNAT.`)
      return false
    }
    if (estado !== "ACEPTADO") {
      toast.info("Este comprobante no esta aceptado por SUNAT.")
      return false
    }
    if (isVentaAnulada(comprobante)) {
      toast.info("Este comprobante pertenece a una venta anulada.")
      return false
    }
    return true
  }

  function handleNotaCredito() {
    if (!validateNota("Credito")) return
    if (onNotaCredito) {
      onNotaCredito(comprobante)
      return
    }
    navigate(`/comprobantes/notas-credito/nueva?comprobante_id=${comprobante.id}`)
  }

  function handleNotaDebito() {
    if (!validateNota("Debito")) return
    if (onNotaDebito) {
      onNotaDebito(comprobante)
      return
    }
    navigate(`/comprobantes/notas-debito/nueva?comprobante_id=${comprobante.id}`)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Acciones de comprobante"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={comprobante.id < 0 && comprobante.venta_id ? `/ventas/${comprobante.venta_id}` : `/comprobantes/${comprobante.id}`}><Eye className="mr-2 h-4 w-4" />Ver detalle</Link>
          </DropdownMenuItem>
          {canEmitir ? (
            <DropdownMenuItem onClick={() => emitir.mutate(Number(comprobante.venta_id))} disabled={emitir.isPending}>
              <Send className="mr-2 h-4 w-4" />Enviar SUNAT
            </DropdownMenuItem>
          ) : null}
          {canReenviar ? (
            <DropdownMenuItem onClick={() => reenviar.mutate(comprobante.id)} disabled={reenviar.isPending}>
              <RefreshCcw className="mr-2 h-4 w-4" />Reenviar
            </DropdownMenuItem>
          ) : null}
          {canNotas && canCrearNc ? (
            <DropdownMenuItem onClick={handleNotaCredito}>
              <FilePlus2 className="mr-2 h-4 w-4" />Generar Nota de Credito
            </DropdownMenuItem>
          ) : null}
          {canNotas && canCrearNd ? (
            <DropdownMenuItem onClick={handleNotaDebito}>
              <FilePlus2 className="mr-2 h-4 w-4" />Generar Nota de Debito
            </DropdownMenuItem>
          ) : null}
          {canSolicitarBaja ? (
            <DropdownMenuItem onSelect={(event) => { event.preventDefault(); setOpenBaja(true) }} className="text-destructive focus:text-destructive">
              <Ban className="mr-2 h-4 w-4" />Dar de baja
            </DropdownMenuItem>
          ) : null}
          {estado === "RECHAZADO" || estado === "ERROR" ? (
            <DropdownMenuItem onClick={() => toast.info(comprobante.mensaje_respuesta ?? "Sin mensaje SUNAT.")}>Ver mensaje</DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <SolicitarBajaDialog
        open={openBaja}
        onOpenChange={setOpenBaja}
        isSubmitting={solicitarBaja.isPending}
        comprobanteNumero={comprobante.numero_comprobante}
        onConfirm={async (motivo_baja) => {
          await solicitarBaja.mutateAsync({ comprobanteId: comprobante.id, motivo_baja })
          setOpenBaja(false)
        }}
      />
    </>
  )
}
