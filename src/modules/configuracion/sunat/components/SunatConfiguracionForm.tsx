import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"

import { SunatGreConfigSection } from "@/modules/configuracion/sunat/components/SunatGreConfigSection"
import { sunatConfiguracionSchema } from "@/modules/configuracion/sunat/schemas/sunatConfiguracion.schema"
import type { SunatConfiguracion, SunatConfiguracionFormValues } from "@/modules/configuracion/sunat/types/sunatConfiguracion.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import type { LaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

const emptyValues: SunatConfiguracionFormValues = {
  ruc: "",
  razon_social: "",
  nombre_comercial: "",
  direccion_fiscal: "",
  ubigeo: "",
  departamento: "",
  provincia: "",
  distrito: "",
  usuario_sol: "",
  clave_sol: "",
  certificado: null,
  certificado_password: "",
  ambiente: "BETA",
  modo_envio: "MANUAL",
  gre_modo_envio: false,
  gre_client_id: "",
  gre_client_secret: "",
  gre_usuario_sol: "",
  gre_clave_sol: "",
  gre_scope: "",
  estado: true,
}

type Props = {
  configuracion?: SunatConfiguracion | null
  serverErrors?: LaravelValidationErrors
  isSubmitting?: boolean
  onSubmit: (values: SunatConfiguracionFormValues) => void
  onDelete?: () => void
  canDelete?: boolean
  isDeleting?: boolean
}

export function SunatConfiguracionForm({ configuracion, serverErrors, isSubmitting, onSubmit, onDelete, canDelete, isDeleting }: Props) {
  const isEdit = Boolean(configuracion)
  const form = useForm<SunatConfiguracionFormValues>({
    resolver: zodResolver(sunatConfiguracionSchema(isEdit)) as never,
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (!configuracion) {
      form.reset(emptyValues)
      return
    }

    form.reset({
      ruc: configuracion.ruc,
      razon_social: configuracion.razon_social,
      nombre_comercial: configuracion.nombre_comercial ?? "",
      direccion_fiscal: configuracion.direccion_fiscal,
      ubigeo: configuracion.ubigeo,
      departamento: configuracion.departamento,
      provincia: configuracion.provincia,
      distrito: configuracion.distrito,
      usuario_sol: configuracion.usuario_sol,
      clave_sol: "",
      certificado: null,
      certificado_password: "",
      ambiente: configuracion.ambiente,
      modo_envio: configuracion.modo_envio,
      gre_modo_envio: Boolean(configuracion.gre_modo_envio),
      gre_client_id: configuracion.gre_client_id ?? "",
      gre_client_secret: "",
      gre_usuario_sol: configuracion.gre_usuario_sol ?? "",
      gre_clave_sol: "",
      gre_scope: configuracion.gre_scope ?? "",
      estado: configuracion.estado,
    })
  }, [configuracion, form])

  useEffect(() => {
    if (!serverErrors) return
    Object.entries(serverErrors).forEach(([field, messages]) => {
      form.setError(field as keyof SunatConfiguracionFormValues, { type: "server", message: messages[0] })
    })
  }, [form, serverErrors])

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Datos de empresa emisora</CardTitle>
            <CardDescription>Estos datos se usaran para construir los documentos electronicos.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TextField name="ruc" label="RUC" maxLength={11} />
            <TextField name="razon_social" label="Razon social" />
            <TextField name="nombre_comercial" label="Nombre comercial" />
            <div className="md:col-span-2 xl:col-span-3"><TextField name="direccion_fiscal" label="Direccion fiscal" /></div>
            <TextField name="ubigeo" label="Ubigeo" maxLength={6} />
            <TextField name="departamento" label="Departamento" />
            <TextField name="provincia" label="Provincia" />
            <TextField name="distrito" label="Distrito" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credenciales SUNAT</CardTitle>
            <CardDescription>La clave SOL y la clave del certificado se guardan cifradas y no se muestran al editar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEdit ? (
              <Alert>
                <AlertTitle>Credenciales protegidas</AlertTitle>
                <AlertDescription>Deja la clave SOL o certificado vacios para mantener los valores actuales.</AlertDescription>
              </Alert>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              <TextField name="usuario_sol" label="Usuario SOL" />
              <TextField name="clave_sol" label={isEdit ? "Nueva clave SOL" : "Clave SOL"} type="password" />
              <FileField />
              <TextField name="certificado_password" label="Clave certificado" type="password" />
            </div>
            {configuracion?.tiene_certificado ? <p className="text-sm text-muted-foreground">Certificado actual registrado en storage privado. Puede ser PFX/P12 o PEM.</p> : <p className="text-sm text-muted-foreground">Aun no hay certificado digital registrado.</p>}
          </CardContent>
        </Card>

        <SunatGreConfigSection configuracion={configuracion} isEdit={isEdit} disabled={isSubmitting} />

        <Card>
          <CardHeader>
            <CardTitle>Operacion SUNAT</CardTitle>
            <CardDescription>Define ambiente de trabajo y si el envio sera manual o automatico.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <SelectField name="ambiente" label="Ambiente" options={[{ value: "BETA", label: "BETA" }, { value: "PRODUCCION", label: "PRODUCCION" }]} />
            <SelectField name="modo_envio" label="Modo envio" options={[{ value: "MANUAL", label: "Manual" }, { value: "AUTOMATICO", label: "Automatico" }]} />
            <SwitchField />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {isEdit && canDelete ? (
            <Button type="button" variant="destructive" disabled={isSubmitting || isDeleting} onClick={onDelete}>
              {isDeleting ? "Desactivando..." : "Desactivar"}
            </Button>
          ) : null}
          <Button type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting ? "Guardando..." : isEdit ? "Actualizar configuracion" : "Guardar configuracion"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

type FieldName = keyof SunatConfiguracionFormValues

function TextField({ name, label, type = "text", maxLength }: { name: FieldName; label: string; type?: string; maxLength?: number }) {
  const form = useFormContext<SunatConfiguracionFormValues>()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} value={(field.value as string | number | null) ?? ""} type={type} maxLength={maxLength} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function SelectField({ name, label, options }: { name: "ambiente" | "modo_envio"; label: string; options: { value: string; label: string }[] }) {
  const form = useFormContext<SunatConfiguracionFormValues>()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select value={field.value} onValueChange={field.onChange}>
          <FormControl><SelectTrigger aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}><SelectValue /></SelectTrigger></FormControl>
          <SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function SwitchField() {
  const form = useFormContext<SunatConfiguracionFormValues>()
  return (
    <FormField control={form.control} name="estado" render={({ field }) => (
      <FormItem className="flex h-full items-center justify-between rounded-md border px-4 py-3">
        <div className="space-y-1">
          <FormLabel>Configuracion activa</FormLabel>
          <p className="text-sm text-muted-foreground">Solo una configuracion puede estar activa por empresa.</p>
        </div>
        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Activar configuracion SUNAT" /></FormControl>
      </FormItem>
    )} />
  )
}

function FileField() {
  const form = useFormContext<SunatConfiguracionFormValues>()
  return (
    <FormField control={form.control} name="certificado" render={({ fieldState }) => (
      <FormItem>
        <FormLabel>Certificado PFX/P12 o PEM</FormLabel>
        <FormControl>
          <Input type="file" accept=".pfx,.p12,.pem" aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} onChange={(event) => form.setValue("certificado", event.target.files?.[0] ?? null, { shouldValidate: true })} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}



