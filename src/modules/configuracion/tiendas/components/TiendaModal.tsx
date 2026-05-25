import type { ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { tiendaSchema } from "@/modules/configuracion/tiendas/schemas/tienda.schema"
import type { Tienda, TiendaFormValues } from "@/modules/configuracion/tiendas/types/tienda.types"
import type { LaravelValidationErrors } from "@/shared/services/api"

export function TiendaModal({ open, tienda, serverErrors, isSubmitting, onOpenChange, onSubmit }: { open: boolean; tienda?: Tienda | null; serverErrors?: LaravelValidationErrors; isSubmitting?: boolean; onOpenChange: (open: boolean) => void; onSubmit: (values: TiendaFormValues) => void }) {
  const form = useForm<TiendaFormValues>({ resolver: zodResolver(tiendaSchema), defaultValues: { nombre: "", codigo: "", direccion: "", ubigeo: "", telefono: "", estado: true } })
  useEffect(() => { if (open) form.reset({ nombre: tienda?.nombre ?? "", codigo: tienda?.codigo ?? "", direccion: tienda?.direccion ?? "", ubigeo: tienda?.ubigeo ?? "", telefono: tienda?.telefono ?? "", estado: tienda?.estado ?? true }) }, [open, tienda, form])
  useEffect(() => { Object.entries(serverErrors ?? {}).forEach(([k, v]) => form.setError(k as keyof TiendaFormValues, { message: v[0] })) }, [serverErrors, form])
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{tienda ? "Editar tienda" : "Nueva tienda"}</DialogTitle></DialogHeader><form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
    <Field label="Nombre" error={form.formState.errors.nombre?.message}><Input {...form.register("nombre")} aria-invalid={!!form.formState.errors.nombre} /></Field>
    <Field label="Código" error={form.formState.errors.codigo?.message}><Input {...form.register("codigo")} aria-invalid={!!form.formState.errors.codigo} /></Field>
    <Field label="Dirección" error={form.formState.errors.direccion?.message}><Input {...form.register("direccion")} /></Field>
    <div className="grid gap-4 md:grid-cols-2"><Field label="Ubigeo" error={form.formState.errors.ubigeo?.message}><Input {...form.register("ubigeo")} aria-invalid={!!form.formState.errors.ubigeo} /></Field><Field label="Teléfono" error={form.formState.errors.telefono?.message}><Input {...form.register("telefono")} /></Field></div>
    <label className="flex items-center gap-3 text-sm"><Switch checked={form.watch("estado")} onCheckedChange={(v) => form.setValue("estado", v)} /> Activa</label>
    <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar"}</Button></div>
  </form></DialogContent></Dialog>
}
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="space-y-2 text-sm font-medium"><span>{label}</span>{children}{error ? <p className="text-sm text-destructive">{error}</p> : null}</label> }