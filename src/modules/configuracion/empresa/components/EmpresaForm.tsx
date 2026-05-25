import type { ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { empresaSchema } from "@/modules/configuracion/empresa/schemas/empresa.schema"
import type { EmpresaConfiguracion, EmpresaFormValues } from "@/modules/configuracion/empresa/types/empresa.types"
import type { LaravelValidationErrors } from "@/shared/services/api"

type Props = { empresa?: EmpresaConfiguracion | null; isSubmitting?: boolean; serverErrors?: LaravelValidationErrors; onSubmit: (values: EmpresaFormValues) => void }

export function EmpresaForm({ empresa, isSubmitting, serverErrors, onSubmit }: Props) {
  const form = useForm<EmpresaFormValues>({ resolver: zodResolver(empresaSchema), defaultValues: { ruc: "", razon_social: "", nombre_comercial: "", direccion_fiscal: "", ubigeo: "", telefono: "", email: "", estado: true } })

  useEffect(() => {
    if (empresa) form.reset({ ruc: empresa.ruc ?? "", razon_social: empresa.razon_social ?? "", nombre_comercial: empresa.nombre_comercial ?? "", direccion_fiscal: empresa.direccion_fiscal ?? "", ubigeo: empresa.ubigeo ?? "", telefono: empresa.telefono ?? "", email: empresa.email ?? "", estado: empresa.estado })
  }, [empresa, form])

  useEffect(() => {
    Object.entries(serverErrors ?? {}).forEach(([field, messages]) => form.setError(field as keyof EmpresaFormValues, { message: messages[0] }))
  }, [serverErrors, form])

  const file = form.watch("logo")?.item?.(0)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Card><CardHeader><CardTitle>Datos de empresa</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
        <Field label="RUC" error={form.formState.errors.ruc?.message}><Input {...form.register("ruc")} aria-invalid={!!form.formState.errors.ruc} className={form.formState.errors.ruc ? "input-invalid" : ""} /></Field>
        <Field label="Razón social" error={form.formState.errors.razon_social?.message}><Input {...form.register("razon_social")} aria-invalid={!!form.formState.errors.razon_social} /></Field>
        <Field label="Nombre comercial" error={form.formState.errors.nombre_comercial?.message}><Input {...form.register("nombre_comercial")} /></Field>
        <Field label="Ubigeo" error={form.formState.errors.ubigeo?.message}><Input {...form.register("ubigeo")} aria-invalid={!!form.formState.errors.ubigeo} /></Field>
        <Field label="Dirección fiscal" error={form.formState.errors.direccion_fiscal?.message}><Input {...form.register("direccion_fiscal")} aria-invalid={!!form.formState.errors.direccion_fiscal} /></Field>
        <Field label="Teléfono" error={form.formState.errors.telefono?.message}><Input {...form.register("telefono")} /></Field>
        <Field label="Email" error={form.formState.errors.email?.message}><Input {...form.register("email")} /></Field>
        <Field label="Logo" error={form.formState.errors.logo?.message as string}><Input type="file" accept="image/png,image/jpeg,image/webp" {...form.register("logo")} />{file ? <p className="text-xs text-muted-foreground">Nuevo logo: {file.name}</p> : empresa?.logo_url ? <img src={empresa.logo_url} alt="Logo empresa" className="mt-2 h-16 rounded border object-contain" /> : null}</Field>
        <label className="flex items-center gap-3 text-sm"><Switch checked={form.watch("estado")} onCheckedChange={(value) => form.setValue("estado", value)} /> Empresa activa</label>
      </CardContent></Card>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar cambios"}</Button>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="space-y-2 text-sm font-medium"><span>{label}</span>{children}{error ? <p className="text-sm text-destructive">{error}</p> : null}</label>
}