import { FilePlus2, FileText, MoreHorizontal, Printer, ReceiptText, ShoppingCart, XCircle } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { AnularVentaDialog } from "@/modules/ventas/components/AnularVentaDialog"
import { ventaDocumentoService } from "@/modules/ventas/services/ventaDocumento.service"
import type { Venta } from "@/modules/ventas/types/venta.types"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { useAuthStore } from "@/shared/stores/auth.store"

type VentaQuickActionsProps = {
  venta: Venta
  compact?: boolean
}

type LoadingAction = "ticket" | "pdf" | null

function isSunatAccepted(venta: Venta) {
  return ["BOLETA", "FACTURA"].includes(venta.tipo_comprobante) && venta.comprobante_electronico?.estado_sunat === "ACEPTADO"
}

function canAnnulDirectly(venta: Venta) {
  if (venta.estado !== "REGISTRADA") return false
  if (venta.tipo_comprobante === "NOTA_VENTA") return true
  if (["BOLETA", "FACTURA"].includes(venta.tipo_comprobante)) return !isSunatAccepted(venta)
  return false
}

export function VentaQuickActions({ venta, compact = false }: VentaQuickActionsProps) {
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null)
  const [anularOpen, setAnularOpen] = useState(false)
  const navigate = useNavigate()
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const canView = hasPermission("ventas.ver")
  const canPrint = hasPermission("ventas.imprimir")
  const canExport = hasPermission("ventas.exportar")
  const canCreate = hasPermission("ventas.crear")
  const showAnular = canCreate && canAnnulDirectly(venta)
  const canCreateNc = hasAnyPermission(["notas_credito.crear", "sunat.notas.crear"])
  const canCreateNd = hasAnyPermission(["notas_debito.crear", "sunat.notas.crear"])
  const showNotaCredito = canCreateNc && venta.estado === "REGISTRADA" && isSunatAccepted(venta)
  const showNotaDebito = canCreateNd && venta.estado === "REGISTRADA" && isSunatAccepted(venta)

  async function run(action: Exclude<LoadingAction, null>) {
    setLoadingAction(action)
    try {
      if (action === "ticket") {
        const opened = await ventaDocumentoService.abrirTicket(venta)
        toast.success(opened ? "Ticket generado correctamente." : "Ticket generado. Abrelo para imprimir.")
      } else {
        const opened = await ventaDocumentoService.abrirPdf(venta)
        toast.success(opened ? "PDF generado correctamente." : "PDF generado. Abrelo para verlo.")
      }
    } catch (error) {
      toast.error(ventaDocumentoService.getErrorMessage(error))
    } finally {
      setLoadingAction(null)
    }
  }

  function getComprobanteId() {
    return venta.comprobante_electronico?.id
  }

  function validateNotaElectronica(tipo: "Credito" | "Debito") {
    const comprobanteId = getComprobanteId()
    if (venta.tipo_comprobante === "NOTA_VENTA") {
      toast.info(tipo === "Credito" ? "Las notas de venta se anulan internamente." : "Las notas de venta no generan Nota de Debito.")
      return null
    }
    if (!["BOLETA", "FACTURA"].includes(venta.tipo_comprobante)) {
      toast.info(`Solo puedes generar Nota de ${tipo} para boletas o facturas aceptadas por SUNAT.`)
      return null
    }
    if (venta.estado === "ANULADA") {
      toast.info("Este comprobante pertenece a una venta anulada.")
      return null
    }
    if (venta.comprobante_electronico?.estado_sunat !== "ACEPTADO") {
      toast.info("Este comprobante no esta aceptado por SUNAT.")
      return null
    }
    if (!comprobanteId) {
      toast.error("La venta no tiene comprobante electronico asociado.")
      return null
    }
    return comprobanteId
  }

  function goNotaCredito() {
    const comprobanteId = validateNotaElectronica("Credito")
    if (comprobanteId) navigate(`/comprobantes/notas-credito/nueva?comprobante_id=${comprobanteId}`)
  }

  function goNotaDebito() {
    const comprobanteId = validateNotaElectronica("Debito")
    if (comprobanteId) navigate(`/comprobantes/notas-debito/nueva?comprobante_id=${comprobanteId}`)
  }

  if (compact) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Acciones de venta" variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canView ? (
              <DropdownMenuItem asChild>
                <Link to={`/ventas/${venta.id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Ver detalle
                </Link>
              </DropdownMenuItem>
            ) : null}
            {canPrint ? (
              <DropdownMenuItem disabled={loadingAction !== null} onClick={() => run("ticket")}>
                <Printer className="mr-2 h-4 w-4" />
                {loadingAction === "ticket" ? "Generando..." : "Imprimir ticket"}
              </DropdownMenuItem>
            ) : null}
            {canExport ? (
              <DropdownMenuItem disabled={loadingAction !== null} onClick={() => run("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                {loadingAction === "pdf" ? "Generando..." : "Ver PDF"}
              </DropdownMenuItem>
            ) : null}
            {showAnular || showNotaCredito || showNotaDebito ? <DropdownMenuSeparator /> : null}
            {showAnular ? (
              <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(event) => { event.preventDefault(); setAnularOpen(true) }}>
                <XCircle className="mr-2 h-4 w-4" />
                Anular venta
              </DropdownMenuItem>
            ) : null}
            {showNotaCredito ? (
              <DropdownMenuItem onClick={goNotaCredito}>
                <ReceiptText className="mr-2 h-4 w-4" />
                Devolver
              </DropdownMenuItem>
            ) : null}
            {showNotaDebito ? (
              <DropdownMenuItem onClick={goNotaDebito}>
                <FilePlus2 className="mr-2 h-4 w-4" />
                Generar Nota de Debito
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
        <AnularVentaDialog venta={venta} open={anularOpen} onOpenChange={setAnularOpen} />
      </>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/ventas/pos">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Nueva venta
          </Link>
        </Button>
        {canPrint ? (
          <Button disabled={loadingAction !== null} variant="outline" onClick={() => run("ticket")}>
            <Printer className="mr-2 h-4 w-4" />
            {loadingAction === "ticket" ? "Generando..." : "Imprimir ticket"}
          </Button>
        ) : null}
        {canExport ? (
          <Button disabled={loadingAction !== null} variant="outline" onClick={() => run("pdf")}>
            <FileText className="mr-2 h-4 w-4" />
            {loadingAction === "pdf" ? "Generando..." : "Ver PDF"}
          </Button>
        ) : null}
        {showAnular ? (
          <Button variant="destructive" onClick={() => setAnularOpen(true)}>
            <XCircle className="mr-2 h-4 w-4" />
            Anular venta
          </Button>
        ) : null}
        {showNotaCredito ? (
          <Button variant="outline" onClick={goNotaCredito}>
            <ReceiptText className="mr-2 h-4 w-4" />
            Generar Nota de Credito
          </Button>
        ) : null}
        {showNotaDebito ? (
          <Button variant="outline" onClick={goNotaDebito}>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Generar Nota de Debito
          </Button>
        ) : null}
      </div>
      <AnularVentaDialog venta={venta} open={anularOpen} onOpenChange={setAnularOpen} />
    </>
  )
}