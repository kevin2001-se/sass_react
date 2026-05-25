import { FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { useCompraDocumentos } from "@/modules/compras/compras/hooks/useCompraDocumentos"
import type { Compra } from "@/modules/compras/compras/types/compra.types"
import { openBlob } from "@/shared/utils/blob"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function CompraDocumentActions({ compra }: { compra: Compra }) {
  const docs = useCompraDocumentos(compra.id)
  const loading = docs.generarPdf.isPending || docs.descargarPdf.isPending

  async function openPdf() {
    try {
      if (!compra.tiene_pdf) await docs.generarPdf.mutateAsync()
      const blob = await docs.descargarPdf.mutateAsync()
      if (!openBlob(blob)) toast.info("PDF generado. Permite ventanas emergentes para abrirlo.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo abrir el PDF."))
    }
  }

  return <Button type="button" variant="outline" disabled={loading} onClick={openPdf}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}PDF</Button>
}
