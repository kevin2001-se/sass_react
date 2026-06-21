import { useMemo, useState } from "react"
import { Download, Upload } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { downloadBlob } from "@/shared/utils/blob"
import type { CargaMasivaResultado } from "@/modules/inventario/types/inventario.types"

type CargaMasivaInventarioDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  mode: "lotes" | "entrada" | "salida" | "ajuste"
  isSubmitting: boolean
  onSubmit: (payload: { archivo: File; motivo?: string; tipo_ajuste?: "POSITIVO" | "NEGATIVO" }) => Promise<{ data: CargaMasivaResultado; message?: string }>
  onDownloadTemplate: () => Promise<Blob>
}

export function CargaMasivaInventarioDialog({ open, onOpenChange, title, description, mode, isSubmitting, onSubmit, onDownloadTemplate }: CargaMasivaInventarioDialogProps) {
  const [archivo, setArchivo] = useState<File | null>(null)
  const [motivo, setMotivo] = useState("")
  const [tipoAjuste, setTipoAjuste] = useState<"POSITIVO" | "NEGATIVO">("POSITIVO")
  const [resultado, setResultado] = useState<CargaMasivaResultado | null>(null)
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)
  const columnas = useMemo(() => mode === "lotes"
    ? "codigo_barra, codigo_interno o producto_id; codigo_lote; fecha_vencimiento"
    : "codigo_barra, codigo_interno o producto_id; presentacion; codigo_lote; fecha_vencimiento; cantidad; motivo opcional",
  [mode])

  async function downloadTemplate() {
    try {
      setDownloadingTemplate(true)
      const blob = await onDownloadTemplate()
      downloadBlob(blob, `plantilla-${mode}-inventario.xls`)
      toast.success("Plantilla descargada correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo descargar la plantilla."))
    } finally {
      setDownloadingTemplate(false)
    }
  }
  async function submit() {
    if (!archivo) {
      toast.error("Selecciona un archivo Excel o CSV.")
      return
    }

    try {
      const response = await onSubmit({ archivo, motivo: motivo || undefined, tipo_ajuste: mode === "ajuste" ? tipoAjuste : undefined })
      setResultado(response.data)
      toast.success(response.message ?? "Carga masiva procesada.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo procesar la carga masiva."))
    }
  }

  function close(value: boolean) {
    onOpenChange(value)
    if (!value) {
      setArchivo(null)
      setMotivo("")
      setTipoAjuste("POSITIVO")
      setResultado(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTitle>Formato esperado</AlertTitle>
            <AlertDescription>
              Usa columnas: {columnas}. Las filas con <strong>cantidad vacia</strong> se omiten para movimientos.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="archivo-masivo">Archivo</Label>
            <Input id="archivo-masivo" type="file" accept=".xlsx,.xls,.csv,.txt" onChange={(event) => setArchivo(event.target.files?.[0] ?? null)} />
          </div>

          {mode !== "lotes" ? (
            <div className="space-y-2">
              <Label htmlFor="motivo-masivo">Motivo general</Label>
              <Input id="motivo-masivo" value={motivo} onChange={(event) => setMotivo(event.target.value)} placeholder="Ej. Carga masiva de inventario" />
            </div>
          ) : null}

          {mode === "ajuste" ? (
            <div className="space-y-2">
              <Label>Tipo de ajuste</Label>
              <Select value={tipoAjuste} onValueChange={(value) => setTipoAjuste(value as "POSITIVO" | "NEGATIVO")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="POSITIVO">Positivo</SelectItem>
                  <SelectItem value="NEGATIVO">Negativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {resultado ? (
            <div className="grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-md border p-3"><div className="font-semibold">{resultado.total_procesadas}</div><div className="text-muted-foreground">Procesadas</div></div>
              <div className="rounded-md border p-3"><div className="font-semibold">{resultado.total_omitidas}</div><div className="text-muted-foreground">Omitidas</div></div>
              <div className="rounded-md border p-3"><div className="font-semibold">{resultado.total_errores}</div><div className="text-muted-foreground">Errores</div></div>
              {resultado.errores.length ? (
                <div className="md:col-span-3 max-h-44 overflow-auto rounded-md border p-3 text-xs">
                  {resultado.errores.slice(0, 20).map((error) => (
                    <div key={error.fila} className="border-b py-1 last:border-b-0">
                      Fila {error.fila}: {Object.values(error.errores ?? {}).flat().join(" ")}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={downloadTemplate} disabled={downloadingTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Descargar plantilla
          </Button>
          <Button type="button" variant="outline" onClick={() => close(false)}>Cerrar</Button>
          <Button type="button" onClick={submit} disabled={isSubmitting}>
            <Upload className="mr-2 h-4 w-4" />
            Procesar archivo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
