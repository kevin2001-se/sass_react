import { FileText, MoreHorizontal, Printer, RotateCcw, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { ventaDocumentoService } from "@/modules/ventas/services/ventaDocumento.service"
import type { Venta } from "@/modules/ventas/types/venta.types"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { useAuthStore } from "@/shared/stores/auth.store"

type VentaQuickActionsProps = {
  venta: Venta
  compact?: boolean
}

type LoadingAction = "ticket" | "pdf" | null

export function VentaQuickActions({ venta, compact = false }: VentaQuickActionsProps) {
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null)
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const canView = hasPermission("ventas.ver")
  const canPrint = hasPermission("ventas.imprimir")
  const canExport = hasPermission("ventas.exportar")

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

  if (compact) {
    return (
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
          <DropdownMenuItem disabled>
            <RotateCcw className="mr-2 h-4 w-4" />
            Devolucion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
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
      <Button variant="outline" disabled>
        <RotateCcw className="mr-2 h-4 w-4" />
        Devolucion
      </Button>
    </div>
  )
}