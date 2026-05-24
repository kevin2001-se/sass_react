import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"

import { ComprobanteSelector } from "@/modules/comprobantes/notas-debito/components/ComprobanteSelector"
import { NotaDebitoDetalleForm } from "@/modules/comprobantes/notas-debito/components/NotaDebitoDetalleForm"
import { NotaDebitoTotalesPreview } from "@/modules/comprobantes/notas-debito/components/NotaDebitoTotalesPreview"
import { useMotivosNotaDebito } from "@/modules/comprobantes/notas-debito/hooks/useMotivosNotaDebito"
import { notaDebitoSchema, type NotaDebitoFormValues } from "@/modules/comprobantes/notas-debito/schemas/notaDebito.schema"
import { notaDebitoService } from "@/modules/comprobantes/notas-debito/services/notaDebito.service"
import type { LaravelValidationErrors } from "@/shared/services/api"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/shared/utils/cn"

const defaultValues: NotaDebitoFormValues = {
  comprobante_id: 0,
  motivo_codigo: "",
  motivo_descripcion: null,
  afecta_caja: false,
  metodo_pago_cobro: null,
  observacion: null,
  detalles: [{ descripcion: "", cantidad: 1, precio_unitario: 0 }],
}

const metodosPago = ["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"]

type Props = {
  initialComprobanteId?: number | null
  lockComprobante?: boolean
  isSubmitting?: boolean
  serverErrors?: LaravelValidationErrors
  onSubmit: (values: NotaDebitoFormValues) => Promise<void> | void
  onCancel: () => void
}

export function NotaDebitoForm({ initialComprobanteId, lockComprobante, isSubmitting, serverErrors = {}, onSubmit, onCancel }: Props) {
  const form = useForm<NotaDebitoFormValues>({
    resolver: zodResolver(notaDebitoSchema) as Resolver<NotaDebitoFormValues>,
    defaultValues: { ...defaultValues, comprobante_id: initialComprobanteId ?? 0 },
  })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingValues, setPendingValues] = useState<NotaDebitoFormValues | null>(null)
  const allValues = form.watch()
  const comprobanteId = form.watch("comprobante_id")
  const afectaCaja = form.watch("afecta_caja")
  const detallesValue = form.watch("detalles")
  const { data: motivos = [], isLoading: motivosLoading } = useMotivosNotaDebito()

  const comprobanteQuery = useQuery({
    queryKey: ["sunat-comprobante", comprobanteId],
    queryFn: () => notaDebitoService.getComprobante(comprobanteId),
    enabled: Boolean(comprobanteId),
  })
  const comprobante = comprobanteQuery.data

  useEffect(() => {
    if (initialComprobanteId) form.setValue("comprobante_id", initialComprobanteId, { shouldValidate: true })
  }, [form, initialComprobanteId])

  function validateComprobante() {
    if (!comprobante) return true
    if (comprobante.tipo_comprobante === "NOTA_VENTA") {
      form.setError("comprobante_id", { message: "Las notas de venta no generan Nota de Debito." })
      return false
    }
    if (!["BOLETA", "FACTURA"].includes(String(comprobante.tipo_comprobante))) {
      form.setError("comprobante_id", { message: "Solo puedes generar Nota de Debito para boletas o facturas aceptadas por SUNAT." })
      return false
    }
    if (comprobante.estado_sunat !== "ACEPTADO") {
      form.setError("comprobante_id", { message: "Este comprobante no esta aceptado por SUNAT." })
      return false
    }
    if (comprobante.venta?.estado === "ANULADA") {
      form.setError("comprobante_id", { message: "Este comprobante pertenece a una venta anulada." })
      return false
    }
    return true
  }

  async function handleSubmit(values: NotaDebitoFormValues) {
    if (!validateComprobante()) return
    setPendingValues(values)
    setConfirmOpen(true)
  }

  async function confirmSubmit() {
    if (!pendingValues) return
    await onSubmit(pendingValues)
    setConfirmOpen(false)
    setPendingValues(null)
  }

  const serverMessages = Object.entries(serverErrors).flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`))

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {serverMessages.length > 0 ? <Alert variant="destructive"><AlertDescription>{serverMessages.map((message) => <div key={message}>{message}</div>)}</AlertDescription></Alert> : null}

        {lockComprobante ? (
          <Alert>
            <AlertTitle>Comprobante preseleccionado</AlertTitle>
            <AlertDescription>Se cargara la boleta o factura elegida desde ventas/comprobantes. Ingresa el motivo y los conceptos adicionales de la Nota de Debito.</AlertDescription>
          </Alert>
        ) : null}

        <FormField control={form.control} name="comprobante_id" render={({ field, fieldState }) => (
          <FormItem>
            <FormControl>
              <ComprobanteSelector
                value={field.value || null}
                disabled={lockComprobante}
                error={!!fieldState.error || !!serverErrors.comprobante_id}
                onChange={(id) => field.onChange(id ?? 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {comprobanteQuery.isLoading ? <Skeleton className="h-16 w-full" /> : comprobanteQuery.isError ? (
          <Alert variant="destructive"><AlertDescription>No se pudo cargar el comprobante seleccionado.</AlertDescription></Alert>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Datos de la nota</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField control={form.control} name="motivo_codigo" render={({ field, fieldState }) => <FormItem><FormLabel>Motivo</FormLabel><FormControl><AppCombobox value={field.value} onChange={(value) => field.onChange(value ? String(value) : "")} options={motivos.map((item) => ({ value: item.codigo, label: `${item.codigo} ${item.descripcion}` }))} placeholder="Seleccione motivo" searchPlaceholder="Buscar motivo..." loading={motivosLoading} error={!!fieldState.error || !!serverErrors.motivo_codigo} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="motivo_descripcion" render={({ field, fieldState }) => <FormItem><FormLabel>Descripcion del motivo</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className={cn((fieldState.error || serverErrors.motivo_descripcion) && "border-destructive focus-visible:ring-destructive")} placeholder="Opcional" /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="observacion" render={({ field, fieldState }) => <FormItem className="md:col-span-2"><FormLabel>Observacion</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} className={cn((fieldState.error || serverErrors.observacion) && "border-destructive focus-visible:ring-destructive")} placeholder="Detalle interno del adicional" /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="afecta_caja" render={({ field }) => <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={(checked) => { field.onChange(checked); if (!checked) form.setValue("metodo_pago_cobro", null, { shouldValidate: true }) }} /></FormControl><FormLabel className="font-normal">Afecta caja</FormLabel></FormItem>} />
              {afectaCaja ? <FormField control={form.control} name="metodo_pago_cobro" render={({ field, fieldState }) => <FormItem><FormLabel>Metodo de cobro</FormLabel><Select value={field.value ?? ""} onValueChange={field.onChange}><FormControl><SelectTrigger className={cn((fieldState.error || serverErrors.metodo_pago_cobro) && "border-destructive focus-visible:ring-destructive")}><SelectValue placeholder="Seleccione metodo" /></SelectTrigger></FormControl><SelectContent>{metodosPago.map((metodo) => <SelectItem key={metodo} value={metodo}>{metodo}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} /> : null}
            </CardContent>
          </Card>

          <NotaDebitoTotalesPreview values={allValues} />
        </div>

        <NotaDebitoDetalleForm value={detallesValue} onChange={(value) => form.setValue("detalles", value, { shouldValidate: true })} error={form.formState.errors.detalles?.message?.toString() || serverErrors.detalles?.[0]} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting || comprobanteQuery.isLoading}>{isSubmitting ? "Guardando..." : "Guardar nota de debito"}</Button>
        </div>
      </form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Nota de Debito</AlertDialogTitle>
            <AlertDialogDescription>{pendingValues?.afecta_caja ? "Se registrara la nota y se intentara aplicar el ingreso en caja." : "Se registrara la nota sin afectar caja."}</AlertDialogDescription>
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