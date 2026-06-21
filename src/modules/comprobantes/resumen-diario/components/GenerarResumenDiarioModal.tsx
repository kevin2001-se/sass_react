import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/shared/utils/cn"

import { ResumenDiarioAccionBadge } from "./ResumenDiarioAccionBadge"
import { useResumenDiarioDocumentos } from "../hooks/useResumenDiarioDocumentos"
import type { GenerarResumenDiarioPayload } from "../types/resumenDiario.types"
import { toNumber } from "../types/resumenDiario.types"

const generarResumenSchema = z.object({
  fecha_resumen: z.string().min(1, "La fecha del resumen es obligatoria."),
  observacion: z.string().max(500, "La observacion no debe superar 500 caracteres.").optional().nullable(),
})

type GenerarResumenForm = z.infer<typeof generarResumenSchema>

const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" })

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function GenerarResumenDiarioModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: GenerarResumenDiarioPayload) => Promise<void> | void
  loading?: boolean
}) {
  const form = useForm<GenerarResumenForm>({
    resolver: zodResolver(generarResumenSchema),
    defaultValues: { fecha_resumen: today(), observacion: "" },
  })

  const fechaResumen = form.watch("fecha_resumen")
  const documentosQuery = useResumenDiarioDocumentos(open ? fechaResumen : undefined)
  const documentos = documentosQuery.data ?? []
  const bajas = documentos.filter((documento) => documento.accion === "BAJA").length

  const submit = form.handleSubmit(async (values) => {
    await onSubmit({ fecha_resumen: values.fecha_resumen, observacion: values.observacion || null })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generar resumen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Generar resumen diario</DialogTitle>
          <DialogDescription>
            Selecciona la fecha. El resumen incluira altas de boletas y bajas internas pendientes de boletas, NC o ND relacionadas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="space-y-2">
              <Label htmlFor="fecha_resumen">Fecha resumen</Label>
              <Input
                id="fecha_resumen"
                type="date"
                className={cn(form.formState.errors.fecha_resumen && "input-invalid")}
                {...form.register("fecha_resumen")}
              />
              {form.formState.errors.fecha_resumen ? <p className="text-sm text-red-600">{form.formState.errors.fecha_resumen.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacion">Observacion</Label>
              <Textarea id="observacion" rows={3} placeholder="Resumen diario de boletas" {...form.register("observacion")} />
              {form.formState.errors.observacion ? <p className="text-sm text-red-600">{form.formState.errors.observacion.message}</p> : null}
            </div>
          </div>

          <div className="rounded-md border">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
              <div>
                <p className="font-medium">Vista previa</p>
                <p className="text-sm text-muted-foreground">
                  {documentos.length} documento(s). {bajas} baja(s) pendientes por Resumen Diario.
                </p>
              </div>
              {documentosQuery.isFetching ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
            </div>
            <div className="max-h-72 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Accion</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Numero</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Motivo baja</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentosQuery.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Cargando documentos...</TableCell>
                    </TableRow>
                  ) : documentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        No hay boletas, notas o bajas pendientes para esta fecha.
                      </TableCell>
                    </TableRow>
                  ) : (
                    documentos.map((documento, index) => (
                      <TableRow key={`${documento.tipo_documento}-${documento.documento_id ?? documento.comprobante_electronico_id}-${documento.accion}-${index}`}>
                        <TableCell><ResumenDiarioAccionBadge accion={documento.accion} /></TableCell>
                        <TableCell className="font-medium">{documento.tipo_documento}</TableCell>
                        <TableCell>{documento.numero_completo ?? documento.numero_comprobante ?? `${documento.serie ?? ""}-${documento.correlativo ?? ""}`}</TableCell>
                        <TableCell>
                          <div className="font-medium">{documento.cliente_nombre ?? "Cliente varios"}</div>
                          <div className="text-xs text-muted-foreground">{documento.cliente_numero_documento ?? "Sin documento"}</div>
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate text-muted-foreground" title={documento.motivo_baja ?? undefined}>
                          {documento.accion === "BAJA" ? documento.motivo_baja ?? "Baja interna pendiente" : "-"}
                        </TableCell>
                        <TableCell className="text-right font-semibold">{currency.format(toNumber(documento.total))}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={loading || documentosQuery.isFetching}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}