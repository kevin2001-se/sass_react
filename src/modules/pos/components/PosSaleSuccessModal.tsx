import { FileText, Printer, RotateCcw, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { PosDocumentActions } from "@/modules/pos/components/PosDocumentActions"
import { PosSunatStatusBadge } from "@/modules/pos/components/PosSunatStatusBadge"
import { posDocumentoService } from "@/modules/pos/services/posDocumento.service"
import { useParametro } from "@/modules/configuracion/parametros/hooks/useParametros"
import type { PosComprobanteElectronico, PosVentaRegistrada } from "@/modules/pos/types/pos.types"
import { openBlob, openPrintableBlob } from "@/modules/pos/utils/downloadBlob"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Separator } from "@/shared/components/ui/separator"

export function PosSaleSuccessModal({
  open,
  sale,
  onOpenChange,
  onNewSale,
}: {
  open: boolean
  sale: PosVentaRegistrada | null
  onOpenChange: (open: boolean) => void
  onNewSale: () => void
}) {
  const [comprobante, setComprobante] = useState<PosComprobanteElectronico | null>(sale?.comprobante_electronico ?? null)
  const [printing, setPrinting] = useState(false)
  const [openingPdf, setOpeningPdf] = useState(false)
  const printedSaleRef = useRef<number | null>(null)
  const imprimirAutomatico = useParametro<boolean>("imprimir_ticket_automatico", true)

  useEffect(() => {
    setComprobante(sale?.comprobante_electronico ?? null)
  }, [sale])

  useEffect(() => {
    if (!open || !sale || !imprimirAutomatico.value || printedSaleRef.current === sale.id) return
    printedSaleRef.current = sale.id
    void handleTicket()
  }, [open, sale, imprimirAutomatico.value])

  if (!sale) return null
  const currentSale = sale
  const noAplicaSunat = currentSale.tipo_comprobante === "NOTA_VENTA"

  async function handleTicket() {
    try {
      setPrinting(true)
      await posDocumentoService.generarTicketVenta80(currentSale.id)
      const blob = await posDocumentoService.descargarTicketVenta80(currentSale.id)
      if (!openPrintableBlob(blob)) toast.info("El navegador bloqueo la impresion automatica. Usa el boton Imprimir ticket.")
    } catch {
      toast.error("Ticket interno no disponible.")
    } finally {
      setPrinting(false)
    }
  }

  async function handlePdf() {
    try {
      setOpeningPdf(true)
      await posDocumentoService.generarPdfVentaA4(currentSale.id)
      openBlob(await posDocumentoService.descargarPdfVentaA4(currentSale.id))
    } catch {
      toast.error("PDF interno no disponible.")
    } finally {
      setOpeningPdf(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Venta registrada correctamente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md border bg-primary/5 p-4">
            <p className="text-xs text-muted-foreground">Comprobante</p>
            <p className="text-2xl font-bold text-primary">{sale.numero_comprobante}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>{sale.tipo_comprobante}</Badge>
              <Badge variant="outline">{sale.tipo_venta}</Badge>
              <Badge className="bg-emerald-600 text-white">{sale.estado}</Badge>
              <PosSunatStatusBadge estado={noAplicaSunat ? "NO_APLICA" : comprobante?.estado_sunat ?? "PENDIENTE"} />
            </div>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <Info label="Venta ID" value={`#${sale.id}`} />
            <Info label="Total" value={formatCurrency(Number(sale.total))} strong />
            {sale.tipo_venta === "CREDITO" && <Info label="Pago inicial" value={formatCurrency(Number(sale.monto_pagado ?? sale.cuenta_por_cobrar?.monto_pagado ?? 0))} />}
            {sale.tipo_venta === "CREDITO" && <Info label="Saldo pendiente" value={formatCurrency(Number(sale.saldo_pendiente ?? sale.cuenta_por_cobrar?.saldo_pendiente ?? sale.cuenta_por_cobrar?.saldo ?? 0))} strong />}
            {comprobante?.codigo_respuesta && <Info label="Codigo SUNAT" value={comprobante.codigo_respuesta} />}
            {comprobante?.mensaje_respuesta && <Info label="Mensaje SUNAT" value={comprobante.mensaje_respuesta} />}
          </div>

          {sale.tipo_venta === "CREDITO" ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-medium">Cuenta por cobrar generada</p>
              <p>La deuda queda disponible en Ventas / Cuentas por cobrar.</p>
            </div>
          ) : null}

          <Separator />

          <div className="rounded-md border border-dashed p-3 text-sm">
            <p className="font-medium">Formatos internos</p>
            {!imprimirAutomatico.value ? <p className="text-xs text-muted-foreground">Impresion automatica desactivada por parametros. Usa el boton manual.</p> : null}
            <p className="text-muted-foreground">Ticket y PDF se generan desde la venta registrada. SUNAT solo se usa para envio, XML/CDR y estado.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button disabled={printing} type="button" onClick={handleTicket}>
                <Printer className="h-4 w-4" />
                {printing ? "Generando..." : "Imprimir ticket"}
              </Button>
              <Button disabled={openingPdf} type="button" variant="outline" onClick={handlePdf}>
                <FileText className="h-4 w-4" />
                {openingPdf ? "Generando..." : "Ver PDF"}
              </Button>
            </div>
          </div>

          <PosDocumentActions sale={sale} comprobante={comprobante} onComprobanteUpdated={setComprobante} />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button asChild type="button" variant="outline">
            <Link to={`/ventas/${sale.id}`}>
              <Search className="h-4 w-4" />
              Ver venta
            </Link>
          </Button>
          <Button type="button" onClick={onNewSale}>
            <RotateCcw className="h-4 w-4" />
            Nueva venta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Info({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={strong ? "text-lg font-bold" : "font-medium"}>{value}</p>
    </div>
  )
}