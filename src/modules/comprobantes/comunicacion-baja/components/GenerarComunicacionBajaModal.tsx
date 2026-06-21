import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/shared/utils/cn"

import { DocumentosPendientesBajaTable } from "./DocumentosPendientesBajaTable"
import { useDocumentosPendientesBaja } from "../hooks/useDocumentosPendientesBaja"
import type { GenerarComunicacionBajaPayload } from "../types/comunicacionBaja.types"

const generarSchema = z.object({
  fecha_baja: z.string().min(1, "La fecha de baja es obligatoria."),
  observacion: z.string().max(500, "La observacion no debe superar 500 caracteres.").optional().nullable(),
  comprobantes: z.array(z.number()).min(1, "Selecciona al menos un documento pendiente de baja."),
})

type GenerarForm = z.infer<typeof generarSchema>

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function GenerarComunicacionBajaModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: GenerarComunicacionBajaPayload) => Promise<void> | void
  loading?: boolean
}) {
  const form = useForm<GenerarForm>({
    resolver: zodResolver(generarSchema),
    defaultValues: { fecha_baja: today(), observacion: "", comprobantes: [] },
  })
  const fechaBaja = form.watch("fecha_baja")
  const selectedIds = form.watch("comprobantes") ?? []
  const documentos = useDocumentosPendientesBaja({ fecha_baja: fechaBaja }, open && Boolean(fechaBaja))

  useEffect(() => {
    form.setValue("comprobantes", [], { shouldValidate: true })
  }, [fechaBaja])

  const toggle = (id: number, checked: boolean) => {
    const next = checked ? Array.from(new Set([...selectedIds, id])) : selectedIds.filter((current) => current !== id)
    form.setValue("comprobantes", next, { shouldValidate: true, shouldDirty: true })
  }

  const toggleAll = (checked: boolean) => {
    form.setValue("comprobantes", checked ? (documentos.data ?? []).map((documento) => documento.id) : [], { shouldValidate: true, shouldDirty: true })
  }

  const submit = form.handleSubmit(async (values) => {
    await onSubmit({ fecha_baja: values.fecha_baja, comprobantes: values.comprobantes, observacion: values.observacion || null })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generar comunicacion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Generar comunicacion de baja</DialogTitle>
          <DialogDescription>Selecciona documentos con baja interna pendiente para agruparlos en una comunicacion.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fecha_baja">Fecha baja</Label>
              <Input id="fecha_baja" type="date" className={cn(form.formState.errors.fecha_baja && "input-invalid")} {...form.register("fecha_baja")} />
              {form.formState.errors.fecha_baja ? <p className="text-sm text-red-600">{form.formState.errors.fecha_baja.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacion">Observacion</Label>
              <Textarea id="observacion" rows={2} placeholder="Baja de documentos emitidos por error" {...form.register("observacion")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Documentos pendientes</Label>
            <DocumentosPendientesBajaTable
              documentos={documentos.data ?? []}
              selectedIds={selectedIds}
              onToggle={toggle}
              onToggleAll={toggleAll}
              loading={documentos.isLoading}
            />
            {form.formState.errors.comprobantes ? <p className="text-sm text-red-600">{form.formState.errors.comprobantes.message}</p> : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={loading || documentos.isLoading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
