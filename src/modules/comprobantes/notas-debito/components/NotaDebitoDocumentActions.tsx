import { FileText, Printer, Ticket } from "lucide-react"

import { useNotaDebitoDocumentos } from "@/modules/comprobantes/notas-debito/hooks/useNotaDebitoDocumentos"
import type { NotaDebito } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { Button } from "@/shared/components/ui/button"
import { useAuthStore } from "@/shared/stores/auth.store"

export function NotaDebitoDocumentActions({ nota }: { nota: NotaDebito }) {
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const actions = useNotaDebitoDocumentos(nota)

  return (
    <div className="flex flex-wrap gap-2">
      {hasPermission("notas_debito.pdf.descargar") ? (
        <Button variant="outline" disabled={actions.verPdf.isPending} onClick={() => actions.verPdf.mutate()}>
          <FileText className="mr-2 h-4 w-4" />
          {actions.verPdf.isPending ? "Abriendo..." : "PDF A4"}
        </Button>
      ) : null}

      {hasPermission("notas_debito.ticket.descargar") ? (
        <Button variant="outline" disabled={actions.verTicket.isPending} onClick={() => actions.verTicket.mutate()}>
          <Ticket className="mr-2 h-4 w-4" />
          {actions.verTicket.isPending ? "Abriendo..." : "Ticket 80"}
        </Button>
      ) : null}

      {hasPermission("notas_debito.ticket.descargar") ? (
        <Button variant="outline" disabled={actions.imprimirTicket.isPending} onClick={() => actions.imprimirTicket.mutate()}>
          <Printer className="mr-2 h-4 w-4" />
          {actions.imprimirTicket.isPending ? "Imprimiendo..." : "Imprimir ticket"}
        </Button>
      ) : null}

      {hasPermission("notas_debito.pdf.generar") || hasPermission("notas_debito.ticket.generar") ? (
        <Button variant="secondary" disabled={actions.generarFormatos.isPending} onClick={() => actions.generarFormatos.mutate()}>
          {actions.generarFormatos.isPending ? "Generando..." : "Generar formatos"}
        </Button>
      ) : null}
    </div>
  )
}