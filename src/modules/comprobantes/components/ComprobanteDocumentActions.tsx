import { FileArchive, FileCode2, FileText, Printer } from "lucide-react"

import { useComprobanteActions } from "@/modules/comprobantes/hooks/useComprobanteActions"
import type { ComprobanteElectronico } from "@/modules/comprobantes/types/comprobante.types"
import { Button } from "@/shared/components/ui/button"

type Props = { comprobante: ComprobanteElectronico; compact?: boolean }

export function ComprobanteDocumentActions({ comprobante, compact = false }: Props) {
  const { descargar } = useComprobanteActions()

  if (comprobante.id < 0) {
    return <span className="text-xs text-muted-foreground">Pendiente de emision</span>
  }
  const size = compact ? "sm" : "default"
  const variant = compact ? "ghost" : "outline"

  return (
    <div className="flex flex-wrap gap-2">
      <Button size={size} variant={variant} onClick={() => descargar(comprobante.id, "pdf", comprobante.numero_comprobante)}>
        <FileText className="mr-2 h-4 w-4" />PDF
      </Button>
      <Button size={size} variant={variant} onClick={() => descargar(comprobante.id, "ticket80", comprobante.numero_comprobante)}>
        <Printer className="mr-2 h-4 w-4" />Ticket
      </Button>
      <Button size={size} variant={variant} onClick={() => descargar(comprobante.id, "xml", comprobante.numero_comprobante)}>
        <FileCode2 className="mr-2 h-4 w-4" />XML
      </Button>
      <Button size={size} variant={variant} onClick={() => descargar(comprobante.id, "cdr", comprobante.numero_comprobante)}>
        <FileArchive className="mr-2 h-4 w-4" />CDR
      </Button>
    </div>
  )
}