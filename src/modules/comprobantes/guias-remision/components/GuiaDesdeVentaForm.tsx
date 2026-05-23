import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"

import { UbigeoSelector } from "@/modules/comprobantes/guias-remision/components/UbigeoSelector"
import { guiaDesdeVentaSchema, type GuiaDesdeVentaFormValues } from "@/modules/comprobantes/guias-remision/schemas/guiaRemision.schema"
import type { GuiaCatalogo } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"
import type { GuiaVentaData } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import type { LaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

const today = new Date().toISOString().slice(0, 10)

type Props = {
  ventaData?: GuiaVentaData
  motivos: GuiaCatalogo[]
  modalidades: GuiaCatalogo[]
  unidades: GuiaCatalogo[]
  serverErrors?: LaravelValidationErrors
  isSubmitting?: boolean
  disabled?: boolean
  onSubmit: (values: GuiaDesdeVentaFormValues) => void
  onCancel: () => void
}

export function GuiaDesdeVentaForm({ ventaData, motivos, modalidades, unidades, serverErrors, isSubmitting, disabled, onSubmit, onCancel }: Props) {
  const form = useForm<GuiaDesdeVentaFormValues>({
    resolver: zodResolver(guiaDesdeVentaSchema) as never,
    defaultValues: {
      fecha_traslado: today,
      motivo_traslado_codigo: "01",
      motivo_traslado_descripcion: "",
      modalidad_transporte: "02",
      punto_llegada_departamento_id: null,
      punto_llegada_provincia_id: null,
      punto_llegada_distrito_id: null,
      punto_llegada_ubigeo: "",
      punto_llegada_direccion: "",
      peso_total: 1,
      unidad_peso: "KGM",
      numero_bultos: null,
      observacion: "Traslado desde venta",
      conductor_tipo_documento: "DNI",
      conductor_numero_documento: "",
      conductor_nombre: "",
      conductor_licencia: "",
      vehiculo_placa: "",
      transportista_ruc: "",
      transportista_razon_social: "",
    },
  })

  useEffect(() => {
    const direccion = ventaData?.direccion_sugerida || ventaData?.cliente?.direccion
    if (direccion) form.setValue("punto_llegada_direccion", direccion)
  }, [form, ventaData])

  useEffect(() => {
    if (!serverErrors) return
    Object.entries(serverErrors).forEach(([field, messages]) => {
      form.setError(field as keyof GuiaDesdeVentaFormValues, { type: "server", message: messages[0] })
    })
  }, [form, serverErrors])

  const motivo = form.watch("motivo_traslado_codigo")
  const modalidad = form.watch("modalidad_transporte")
  const motivoOptions = motivos.map((item) => ({ value: item.codigo, label: `${item.codigo} - ${item.descripcion}` }))
  const modalidadOptions = modalidades.map((item) => ({ value: item.codigo, label: `${item.codigo} - ${item.descripcion}` }))
  const unidadOptions = unidades.map((item) => ({ value: item.codigo, label: `${item.codigo} - ${item.descripcion}` }))

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={cn(disabled && "opacity-70")}>
          <CardHeader><CardTitle>Datos de traslado</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TextField name="fecha_traslado" label="Fecha traslado" type="date" disabled={disabled} />
            <ComboboxField name="motivo_traslado_codigo" label="Motivo traslado" options={motivoOptions} disabled={disabled} />
            <ComboboxField name="modalidad_transporte" label="Modalidad transporte" options={modalidadOptions} disabled={disabled} />
            <NumberField name="peso_total" label="Peso total" min="0.001" step="0.001" disabled={disabled} />
            {motivo === "13" ? <div className="md:col-span-2"><TextField name="motivo_traslado_descripcion" label="Descripcion motivo" disabled={disabled} /></div> : null}
            <ComboboxField name="unidad_peso" label="Unidad peso" options={unidadOptions} disabled={disabled} />
            <NumberField name="numero_bultos" label="Numero bultos" min="1" step="1" disabled={disabled} />
            <div className="md:col-span-2 xl:col-span-4"><TextareaField name="observacion" label="Observacion" disabled={disabled} /></div>
          </CardContent>
        </Card>

        <Card className={cn(disabled && "opacity-70")}>
          <CardHeader><CardTitle>Punto de llegada</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <UbigeoSelector prefix="punto_llegada" disabled={disabled} />
            <TextField name="punto_llegada_direccion" label="Direccion llegada" disabled={disabled} />
          </CardContent>
        </Card>

        <Card className={cn(disabled && "opacity-70")}>
          <CardHeader><CardTitle>Transporte</CardTitle></CardHeader>
          <CardContent>
            {modalidad === "01" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <TextField name="transportista_ruc" label="RUC transportista" maxLength={11} disabled={disabled} />
                <TextField name="transportista_razon_social" label="Razon social transportista" disabled={disabled} />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <ConductorDocTypeField disabled={disabled} />
                <TextField name="conductor_numero_documento" label="Documento conductor" disabled={disabled} />
                <TextField name="conductor_nombre" label="Nombre conductor" disabled={disabled} />
                <TextField name="conductor_licencia" label="Licencia" disabled={disabled} />
                <TextField name="vehiculo_placa" label="Placa" disabled={disabled} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <GuiaConfirmAction
            title="Limpiar datos de traslado"
            description="Se restauraran los datos sugeridos de la venta seleccionada."
            actionLabel="Limpiar"
            onConfirm={() => form.reset()}
            disabled={disabled || isSubmitting}
          >
            <Button type="button" variant="ghost" disabled={disabled || isSubmitting}>Limpiar</Button>
          </GuiaConfirmAction>
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={disabled || isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar guia"}</Button>
        </div>
      </form>
    </FormProvider>
  )
}

type FieldName = keyof GuiaDesdeVentaFormValues

function TextField({ name, label, type = "text", maxLength, disabled }: { name: FieldName; label: string; type?: string; maxLength?: number; disabled?: boolean }) {
  const form = useFormContext<GuiaDesdeVentaFormValues>()
  return <FormField control={form.control} name={name} render={({ field, fieldState }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><Input {...field} value={(field.value as string | number | null) ?? ""} type={type} maxLength={maxLength} disabled={disabled} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} /></FormControl><FormMessage /></FormItem>} />
}

function NumberField({ name, label, min, step, disabled }: { name: FieldName; label: string; min: string; step: string; disabled?: boolean }) {
  const form = useFormContext<GuiaDesdeVentaFormValues>()
  return <FormField control={form.control} name={name} render={({ field, fieldState }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type="number" min={min} step={step} value={(field.value as string | number | null) ?? ""} onChange={(event) => field.onChange(event.target.value)} disabled={disabled} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} /></FormControl><FormMessage /></FormItem>} />
}

function TextareaField({ name, label, disabled }: { name: FieldName; label: string; disabled?: boolean }) {
  const form = useFormContext<GuiaDesdeVentaFormValues>()
  return <FormField control={form.control} name={name} render={({ field, fieldState }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><Textarea {...field} value={(field.value as string | number | null) ?? ""} disabled={disabled} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} /></FormControl><FormMessage /></FormItem>} />
}

function ComboboxField({ name, label, options, disabled }: { name: FieldName; label: string; options: { value: string | number; label: string }[]; disabled?: boolean }) {
  const form = useFormContext<GuiaDesdeVentaFormValues>()
  return <FormField control={form.control} name={name} render={({ field, fieldState }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><AppCombobox value={field.value as string | number | null} onChange={(value) => field.onChange(value ?? "")} options={options} error={!!fieldState.error} disabled={disabled} allowClear={false} /></FormControl><FormMessage /></FormItem>} />
}

function ConductorDocTypeField({ disabled }: { disabled?: boolean }) {
  const form = useFormContext<GuiaDesdeVentaFormValues>()
  return <FormField control={form.control} name="conductor_tipo_documento" render={({ field, fieldState }) => <FormItem><FormLabel>Tipo doc. conductor</FormLabel><Select value={field.value ?? "DNI"} onValueChange={field.onChange} disabled={disabled}><FormControl><SelectTrigger aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="DNI">DNI</SelectItem><SelectItem value="CE">CE</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
}


