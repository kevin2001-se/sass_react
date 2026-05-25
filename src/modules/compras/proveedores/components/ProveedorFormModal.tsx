import type { ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { proveedorSchema } from "@/modules/compras/proveedores/schemas/proveedor.schema"
import { tipoDocumentoProveedorOptions, type Proveedor, type ProveedorFormValues } from "@/modules/compras/proveedores/types/proveedor.types"
import type { LaravelValidationErrors } from "@/shared/services/api"

type Props = { open: boolean; proveedor?: Proveedor | null; serverErrors?: LaravelValidationErrors; isSubmitting?: boolean; onOpenChange: (open: boolean) => void; onSubmit: (values: ProveedorFormValues) => void }

export function ProveedorFormModal({ open, proveedor, serverErrors, isSubmitting, onOpenChange, onSubmit }: Props) {
  const form = useForm<ProveedorFormValues>({ resolver: zodResolver(proveedorSchema) as never, defaultValues: { tipo_documento: "RUC", numero_documento: "", razon_social: "", nombre_comercial: "", direccion: "", ubigeo: "", telefono: "", email: "", contacto: "", estado: true } })

  useEffect(() => {
    if (!open) return
    form.reset({ tipo_documento: proveedor?.tipo_documento ?? "RUC", numero_documento: proveedor?.numero_documento ?? "", razon_social: proveedor?.razon_social ?? "", nombre_comercial: proveedor?.nombre_comercial ?? "", direccion: proveedor?.direccion ?? "", ubigeo: proveedor?.ubigeo ?? "", telefono: proveedor?.telefono ?? "", email: proveedor?.email ?? "", contacto: proveedor?.contacto ?? "", estado: proveedor?.estado ?? true })
  }, [open, proveedor, form])

  useEffect(() => {
    Object.entries(serverErrors ?? {}).forEach(([field, messages]) => form.setError(field as keyof ProveedorFormValues, { message: messages[0] }))
  }, [serverErrors, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{proveedor ? "Editar proveedor" : "Nuevo proveedor"}</DialogTitle>
          <DialogDescription>Los proveedores pertenecen a la empresa y no dependen de una tienda.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Tipo documento" error={form.formState.errors.tipo_documento?.message}>
              <AppCombobox value={form.watch("tipo_documento")} onChange={(value) => form.setValue("tipo_documento", value as ProveedorFormValues["tipo_documento"], { shouldValidate: true })} options={tipoDocumentoProveedorOptions} error={!!form.formState.errors.tipo_documento} />
            </Field>
            <Field label="Número documento" error={form.formState.errors.numero_documento?.message}><Input {...form.register("numero_documento")} aria-invalid={!!form.formState.errors.numero_documento} className={form.formState.errors.numero_documento ? "input-invalid" : ""} /></Field>
            <Field label="Ubigeo" error={form.formState.errors.ubigeo?.message}><Input {...form.register("ubigeo")} aria-invalid={!!form.formState.errors.ubigeo} className={form.formState.errors.ubigeo ? "input-invalid" : ""} /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Razón social" error={form.formState.errors.razon_social?.message}><Input {...form.register("razon_social")} aria-invalid={!!form.formState.errors.razon_social} className={form.formState.errors.razon_social ? "input-invalid" : ""} /></Field>
            <Field label="Nombre comercial" error={form.formState.errors.nombre_comercial?.message}><Input {...form.register("nombre_comercial")} /></Field>
          </div>
          <Field label="Dirección" error={form.formState.errors.direccion?.message}><Input {...form.register("direccion")} /></Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Teléfono" error={form.formState.errors.telefono?.message}><Input {...form.register("telefono")} /></Field>
            <Field label="Email" error={form.formState.errors.email?.message}><Input {...form.register("email")} aria-invalid={!!form.formState.errors.email} className={form.formState.errors.email ? "input-invalid" : ""} /></Field>
            <Field label="Contacto" error={form.formState.errors.contacto?.message}><Input {...form.register("contacto")} /></Field>
          </div>
          <label className="flex items-center gap-3 text-sm"><Switch checked={form.watch("estado")} onCheckedChange={(value) => form.setValue("estado", value)} /> Proveedor activo</label>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="space-y-2 text-sm font-medium"><span>{label}</span>{children}{error ? <p className="text-sm text-destructive">{error}</p> : null}</label>
}