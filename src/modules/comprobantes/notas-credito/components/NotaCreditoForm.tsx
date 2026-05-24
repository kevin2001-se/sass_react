import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm, type Resolver } from "react-hook-form"

import { ComprobanteSelector } from "@/modules/comprobantes/notas-credito/components/ComprobanteSelector"
import { NotaCreditoItemsSelector } from "@/modules/comprobantes/notas-credito/components/NotaCreditoItemsSelector"
import { NotaCreditoTotalesPreview } from "@/modules/comprobantes/notas-credito/components/NotaCreditoTotalesPreview"
import { useMotivosNotaCredito } from "@/modules/comprobantes/notas-credito/hooks/useMotivosNotaCredito"
import { notaCreditoSchema, type NotaCreditoFormValues } from "@/modules/comprobantes/notas-credito/schemas/notaCredito.schema"
import { notaCreditoService } from "@/modules/comprobantes/notas-credito/services/notaCredito.service"
import type { LaravelValidationErrors } from "@/shared/services/api"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/shared/utils/cn"

const defaultValues: NotaCreditoFormValues = {
  comprobante_id: 0,
  motivo_codigo: "",
  motivo_descripcion: null,
  tipo_nota: "TOTAL",
  afecta_stock: true,
  afecta_caja: true,
  observacion: null,
  detalles: [],
}

type Props = {
  isSubmitting?: boolean
  serverErrors?: LaravelValidationErrors
  initialComprobanteId?: number | null
  lockComprobante?: boolean
  onSubmit: (values: NotaCreditoFormValues) => Promise<void> | void
  onCancel: () => void
}

function availableQuantity(detalle: { cantidad_disponible_devolucion?: number | string | null; cantidad_presentacion?: number | string | null; cantidad?: number | string | null }) {
  return Number(detalle.cantidad_disponible_devolucion ?? detalle.cantidad_presentacion ?? detalle.cantidad ?? 0)
}

export function NotaCreditoForm({ isSubmitting, serverErrors = {}, initialComprobanteId, lockComprobante, onSubmit, onCancel }: Props) {
  const form = useForm<NotaCreditoFormValues>({ resolver: zodResolver(notaCreditoSchema) as Resolver<NotaCreditoFormValues>, defaultValues: { ...defaultValues, comprobante_id: initialComprobanteId ?? 0 } })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingValues, setPendingValues] = useState<NotaCreditoFormValues | null>(null)
  const comprobanteId = form.watch("comprobante_id")
  const tipoNota = form.watch("tipo_nota")
  const motivoCodigo = form.watch("motivo_codigo")
  const detallesValue = form.watch("detalles")
  const allValues = form.watch()
  const { data: motivos = [], isLoading: motivosLoading } = useMotivosNotaCredito()
  const comprobanteQuery = useQuery({
    queryKey: ["sunat-comprobante", comprobanteId],
    queryFn: () => notaCreditoService.getComprobante(comprobanteId),
    enabled: Boolean(comprobanteId),
  })
  const detalles = comprobanteQuery.data?.venta?.detalles ?? []

  useEffect(() => {
    if (initialComprobanteId) {
      form.setValue("comprobante_id", initialComprobanteId, { shouldValidate: true })
    }
  }, [form, initialComprobanteId])

  useEffect(() => {
    if (motivoCodigo === "08" && tipoNota !== "PARCIAL") {
      form.setValue("tipo_nota", "PARCIAL", { shouldValidate: true })
    }
  }, [form, motivoCodigo, tipoNota])

  useEffect(() => {
    if (tipoNota === "TOTAL") {
      form.setValue("detalles", [], { shouldValidate: true })
    }
  }, [form, tipoNota])

  async function handleSubmit(values: NotaCreditoFormValues) {
    if (comprobanteQuery.data && !["BOLETA", "FACTURA"].includes(String(comprobanteQuery.data.tipo_comprobante))) {
      form.setError("comprobante_id", { message: "Solo puedes generar Nota de Crédito para boletas o facturas aceptadas por SUNAT." })
      return
    }
    if (comprobanteQuery.data?.estado_sunat !== "ACEPTADO") {
      form.setError("comprobante_id", { message: "Este comprobante no está aceptado por SUNAT." })
      return
    }

    if (values.tipo_nota === "PARCIAL") {
      for (const item of values.detalles) {
        const detalle = detalles.find((row) => row.id === Number(item.venta_detalle_id))
        const max = detalle ? availableQuantity(detalle) : 0
        if (Number(item.cantidad) > max) {
          form.setError("detalles", { message: "Una cantidad supera lo disponible para devolucion." })
          return
        }
      }
    }

    setPendingValues({ ...values, detalles: values.tipo_nota === "TOTAL" ? [] : values.detalles })
    setConfirmOpen(true)
  }

  async function confirmSubmit() {
    if (!pendingValues) return
    await onSubmit(pendingValues)
    setConfirmOpen(false)
    setPendingValues(null)
  }

  const serverMessages = Object.entries(serverErrors).flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`))
  const confirmDescription = [
    pendingValues?.tipo_nota === "TOTAL" ? "Se creará una Nota de Crédito total." : "Se creará una Nota de Crédito parcial.",
    pendingValues?.afecta_stock ? "Aplicará devolución de stock." : "No afectará stock.",
    pendingValues?.afecta_caja ? "Aplicará reverso de caja si corresponde." : "No afectará caja.",
  ].join(" ")

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {serverMessages.length > 0 ? <Alert variant="destructive"><AlertDescription>{serverMessages.map((message) => <div key={message}>{message}</div>)}</AlertDescription></Alert> : null}
        {lockComprobante ? <Alert><AlertDescription>Comprobante preseleccionado desde ventas/comprobantes. Continúa con el motivo y tipo de nota.</AlertDescription></Alert> : null}

        <FormField control={form.control} name="comprobante_id" render={({ field, fieldState }) => <FormItem><FormControl><ComprobanteSelector value={field.value || null} disabled={lockComprobante} error={!!fieldState.error || !!serverErrors.comprobante_id} onChange={(id) => field.onChange(id ?? 0)} /></FormControl><FormMessage /></FormItem>} />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Datos de la nota</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField control={form.control} name="motivo_codigo" render={({ field, fieldState }) => <FormItem><FormLabel>Motivo</FormLabel><FormControl><AppCombobox value={field.value} onChange={(value) => field.onChange(value ? String(value) : "")} options={motivos.map((item) => ({ value: item.codigo, label: `${item.codigo} ${item.descripcion}` }))} placeholder="Seleccione motivo" searchPlaceholder="Buscar motivo..." loading={motivosLoading} error={!!fieldState.error || !!serverErrors.motivo_codigo} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="tipo_nota" render={({ field, fieldState }) => <FormItem><FormLabel>Tipo</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger className={cn((fieldState.error || serverErrors.tipo_nota) && "border-destructive focus-visible:ring-destructive")}><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="TOTAL">TOTAL</SelectItem><SelectItem value="PARCIAL">PARCIAL</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
              <FormField control={form.control} name="motivo_descripcion" render={({ field, fieldState }) => <FormItem className="md:col-span-2"><FormLabel>Descripcion del motivo</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className={cn((fieldState.error || serverErrors.motivo_descripcion) && "border-destructive focus-visible:ring-destructive")} placeholder="Opcional" /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="observacion" render={({ field, fieldState }) => <FormItem className="md:col-span-2"><FormLabel>Observacion</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} className={cn((fieldState.error || serverErrors.observacion) && "border-destructive focus-visible:ring-destructive")} placeholder="Detalle interno de la devolucion" /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="afecta_stock" render={({ field }) => <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Afecta stock</FormLabel></FormItem>} />
              <FormField control={form.control} name="afecta_caja" render={({ field }) => <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Afecta caja</FormLabel></FormItem>} />
            </CardContent>
          </Card>

          <NotaCreditoTotalesPreview detalles={detalles} values={allValues} comprobante={comprobanteQuery.data} />
        </div>

        <NotaCreditoItemsSelector detalles={detalles} tipoNota={tipoNota} value={detallesValue} onChange={(value) => form.setValue("detalles", value, { shouldValidate: true })} error={tipoNota === "PARCIAL" ? (form.formState.errors.detalles?.message?.toString() || serverErrors.detalles?.[0]) : undefined} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting || comprobanteQuery.isLoading}>{isSubmitting ? "Guardando..." : "Guardar nota de credito"}</Button>
        </div>
      </form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Nota de Crédito</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={isSubmitting} onClick={(event) => { event.preventDefault(); void confirmSubmit() }}>{isSubmitting ? "Guardando..." : "Confirmar"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  )
}


