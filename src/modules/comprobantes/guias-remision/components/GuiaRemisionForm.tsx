import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"

import { GuiaConfirmAction } from "@/modules/comprobantes/guias-remision/components/GuiaConfirmAction"
import { GuiaRemisionProductosTable } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionProductosTable"
import { UbigeoSelector } from "@/modules/comprobantes/guias-remision/components/UbigeoSelector"
import { guiaRemisionSchema, type GuiaRemisionFormValues } from "@/modules/comprobantes/guias-remision/schemas/guiaRemision.schema"
import type { GuiaCatalogo } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import type { LaravelValidationErrors } from "@/shared/services/api"
import { useAuthStore } from "@/shared/stores/auth.store"
import { cn } from "@/shared/utils/cn"

const today = new Date().toISOString().slice(0, 10)

const defaultValues: GuiaRemisionFormValues = {
  fecha_emision: today,
  fecha_traslado: today,
  motivo_traslado_codigo: "01",
  motivo_traslado_descripcion: "",
  modalidad_transporte: "02",
  peso_total: 1,
  unidad_peso: "KGM",
  numero_bultos: null,
  observacion: "",
  destinatario_tipo_documento: "RUC",
  destinatario_numero_documento: "",
  destinatario_nombre: "",
  punto_partida_departamento_id: null,
  punto_partida_provincia_id: null,
  punto_partida_distrito_id: null,
  punto_partida_ubigeo: "",
  punto_partida_direccion: "",
  punto_llegada_departamento_id: null,
  punto_llegada_provincia_id: null,
  punto_llegada_distrito_id: null,
  punto_llegada_ubigeo: "",
  punto_llegada_direccion: "",
  conductor_tipo_documento: "DNI",
  conductor_numero_documento: "",
  conductor_nombre: "",
  conductor_licencia: "",
  vehiculo_placa: "",
  transportista_ruc: "",
  transportista_razon_social: "",
  detalles: [{ producto_id: null, descripcion: "", unidad_medida: "NIU", cantidad: 1, peso: null }],
}

type Props = {
  motivos: GuiaCatalogo[]
  modalidades: GuiaCatalogo[]
  unidades: GuiaCatalogo[]
  serverErrors?: LaravelValidationErrors
  isSubmitting?: boolean
  onSubmit: (values: GuiaRemisionFormValues) => void
  onCancel: () => void
}

export function GuiaRemisionForm({ motivos, modalidades, unidades, serverErrors, isSubmitting, onSubmit, onCancel }: Props) {
  const tiendaActiva = useAuthStore((state) => state.tiendaActiva)
  const form = useForm<GuiaRemisionFormValues>({
    resolver: zodResolver(guiaRemisionSchema) as never,
    defaultValues,
  })


  useEffect(() => {
    if (!tiendaActiva) return
    if (!form.getValues("punto_partida_ubigeo") && tiendaActiva.ubigeo) {
      form.setValue("punto_partida_ubigeo", tiendaActiva.ubigeo)
    }
    if (!form.getValues("punto_partida_direccion") && tiendaActiva.direccion) {
      form.setValue("punto_partida_direccion", tiendaActiva.direccion)
    }
  }, [form, tiendaActiva])
  useEffect(() => {
    if (!serverErrors) return
    Object.entries(serverErrors).forEach(([field, messages]) => {
      form.setError(field as keyof GuiaRemisionFormValues, { type: "server", message: messages[0] })
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
        <Card>
          <CardHeader><CardTitle>Datos generales</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TextField name="fecha_emision" label="Fecha emision" type="date" />
            <TextField name="fecha_traslado" label="Fecha traslado" type="date" />
            <ComboboxField name="motivo_traslado_codigo" label="Motivo traslado" options={motivoOptions} allowClear={false} />
            <ComboboxField name="modalidad_transporte" label="Modalidad transporte" options={modalidadOptions} allowClear={false} />
            {motivo === "13" ? <div className="md:col-span-2"><TextField name="motivo_traslado_descripcion" label="Descripcion motivo" placeholder="Indique el motivo" /></div> : null}
            <NumberField name="peso_total" label="Peso total" min="0.001" step="0.001" />
            <ComboboxField name="unidad_peso" label="Unidad peso" options={unidadOptions} allowClear={false} />
            <NumberField name="numero_bultos" label="Numero bultos" min="1" step="1" />
            <div className="md:col-span-2 xl:col-span-4"><TextareaField name="observacion" label="Observacion" placeholder="Observacion opcional" /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Destinatario</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <DocumentTypeField name="destinatario_tipo_documento" label="Tipo documento" />
            <TextField name="destinatario_numero_documento" label="Numero documento" />
            <TextField name="destinatario_nombre" label="Nombre / razon social" />
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Punto partida</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <UbigeoSelector prefix="punto_partida" />
              <TextField name="punto_partida_direccion" label="Direccion" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Punto llegada</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <UbigeoSelector prefix="punto_llegada" />
              <TextField name="punto_llegada_direccion" label="Direccion" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Transporte</CardTitle></CardHeader>
          <CardContent>
            {modalidad === "01" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <TextField name="transportista_ruc" label="RUC transportista" maxLength={11} />
                <TextField name="transportista_razon_social" label="Razon social transportista" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <ConductorDocTypeField />
                <TextField name="conductor_numero_documento" label="Documento conductor" />
                <TextField name="conductor_nombre" label="Nombre conductor" />
                <TextField name="conductor_licencia" label="Licencia" />
                <TextField name="vehiculo_placa" label="Placa" />
              </div>
            )}
          </CardContent>
        </Card>

        <GuiaRemisionProductosTable unidades={unidades} />

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <GuiaConfirmAction
            title="Limpiar formulario"
            description="Se borraran los datos ingresados y se restaurara el punto de partida de la tienda activa."
            actionLabel="Limpiar"
            onConfirm={() => form.reset({ ...defaultValues, punto_partida_ubigeo: tiendaActiva?.ubigeo ?? "", punto_partida_direccion: tiendaActiva?.direccion ?? "" })}
            disabled={isSubmitting}
          >
            <Button type="button" variant="ghost" disabled={isSubmitting}>Limpiar</Button>
          </GuiaConfirmAction>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar guia"}</Button>
        </div>
      </form>
    </FormProvider>
  )
}

type FieldName = keyof GuiaRemisionFormValues

function TextField({ name, label, type = "text", placeholder, maxLength }: { name: FieldName; label: string; type?: string; placeholder?: string; maxLength?: number }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} value={(field.value as string | number | null) ?? ""} type={type} placeholder={placeholder} maxLength={maxLength} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function NumberField({ name, label, min, step }: { name: FieldName; label: string; min: string; step: string }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input type="number" min={min} step={step} value={(field.value as string | number | null) ?? ""} onChange={(event) => field.onChange(event.target.value)} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function TextareaField({ name, label, placeholder }: { name: FieldName; label: string; placeholder?: string }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea {...field} value={(field.value as string | number | null) ?? ""} placeholder={placeholder} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function ComboboxField({ name, label, options, allowClear = true }: { name: FieldName; label: string; options: { value: string | number; label: string }[]; allowClear?: boolean }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <AppCombobox value={field.value as string | number | null} onChange={(value) => field.onChange(value ?? "")} options={options} error={!!fieldState.error} allowClear={allowClear} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function DocumentTypeField({ name, label }: { name: "destinatario_tipo_documento"; label: string }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select value={field.value} onValueChange={field.onChange}>
          <FormControl><SelectTrigger aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}><SelectValue /></SelectTrigger></FormControl>
          <SelectContent>
            <SelectItem value="DNI">DNI</SelectItem>
            <SelectItem value="RUC">RUC</SelectItem>
            <SelectItem value="CE">CE</SelectItem>
            <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
            <SelectItem value="SIN_DOCUMENTO">Sin documento</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function ConductorDocTypeField() {
  const form = useFormContext<GuiaRemisionFormValues>()
  return (
    <FormField control={form.control} name="conductor_tipo_documento" render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>Tipo doc. conductor</FormLabel>
        <Select value={field.value ?? "DNI"} onValueChange={field.onChange}>
          <FormControl><SelectTrigger aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}><SelectValue /></SelectTrigger></FormControl>
          <SelectContent>
            <SelectItem value="DNI">DNI</SelectItem>
            <SelectItem value="CE">CE</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )} />
  )
}



