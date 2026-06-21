import { useState } from "react"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { downloadBlob, openBlob } from "@/shared/utils/blob"
import { reporteService } from "@/modules/reportes/services/reporte.service"
import type { ReporteFilters } from "@/modules/reportes/types/reporte.types"
import { getLaravelErrorMessage } from "@/shared/services/api"

type ReporteExportActionsProps = {
  grupo: string
  reporte: string
  filters: ReporteFilters
  filename: string
  allowPdf?: boolean
}

export function ReporteExportActions({ grupo, reporte, filters, filename, allowPdf = true }: ReporteExportActionsProps) {
  const [loading, setLoading] = useState<"excel" | "pdf" | null>(null)

  const exportExcel = async () => {
    try {
      setLoading("excel")
      const blob = await reporteService.exportExcel(grupo, reporte, filters)
      downloadBlob(blob, `${filename}.xls`)
      toast.success("Excel generado correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo generar el Excel."))
    } finally {
      setLoading(null)
    }
  }

  const exportPdf = async () => {
    try {
      setLoading("pdf")
      const blob = await reporteService.exportPdf(grupo, reporte, filters)
      if (!openBlob(blob)) {
        downloadBlob(blob, `${filename}.pdf`)
      }
      toast.success("PDF generado correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo generar el PDF."))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={exportExcel} disabled={loading !== null}>
        {loading === "excel" ? <Download className="mr-2 h-4 w-4 animate-pulse" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
        Excel
      </Button>
      {allowPdf ? (
        <Button type="button" variant="outline" onClick={exportPdf} disabled={loading !== null}>
          {loading === "pdf" ? <Download className="mr-2 h-4 w-4 animate-pulse" /> : <FileText className="mr-2 h-4 w-4" />}
          PDF
        </Button>
      ) : null}
    </div>
  )
}
