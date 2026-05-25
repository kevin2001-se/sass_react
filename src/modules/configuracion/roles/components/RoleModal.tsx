import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { roleSchema } from "@/modules/configuracion/roles/schemas/role.schema"
import type { Permission, Role, RoleFormValues } from "@/modules/configuracion/roles/types/role.types"
import type { LaravelValidationErrors } from "@/shared/services/api"

export function RoleModal({ open, role, permisos, serverErrors, isSubmitting, onOpenChange, onSubmit }: { open: boolean; role?: Role | null; permisos: Permission[]; serverErrors?: LaravelValidationErrors; isSubmitting?: boolean; onOpenChange: (open: boolean) => void; onSubmit: (values: RoleFormValues) => void }) {
  const form = useForm<RoleFormValues>({ resolver: zodResolver(roleSchema), defaultValues: { name: "", description: "", active: true, permissions: [] } })
  const selected = form.watch("permissions") ?? []
  const grouped = useMemo(() => permisos.reduce<Record<string, Permission[]>>((acc, p) => { (acc[p.modulo] ??= []).push(p); return acc }, {}), [permisos])
  useEffect(() => { if (open) form.reset({ name: role?.name ?? "", description: role?.description ?? "", active: role?.active ?? true, permissions: role?.permission_ids ?? role?.permissions?.map((p) => p.id) ?? [] }) }, [open, role, form])
  useEffect(() => { Object.entries(serverErrors ?? {}).forEach(([k, v]) => form.setError(k as keyof RoleFormValues, { message: v[0] })) }, [serverErrors, form])
  function toggle(id: number, checked: boolean) { form.setValue("permissions", checked ? [...selected, id] : selected.filter((x) => x !== id)) }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{role ? "Editar rol" : "Nuevo rol"}</DialogTitle></DialogHeader><form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}><div className="grid gap-4 md:grid-cols-2"><label className="space-y-2 text-sm font-medium">Nombre<Input {...form.register("name")} aria-invalid={!!form.formState.errors.name} />{form.formState.errors.name ? <p className="text-sm text-destructive">{form.formState.errors.name.message}</p> : null}</label><label className="space-y-2 text-sm font-medium">Descripción<Input {...form.register("description")} /></label></div><label className="flex items-center gap-3 text-sm"><Switch checked={form.watch("active")} onCheckedChange={(v) => form.setValue("active", v)} /> Rol activo</label><div className="rounded-md border"><div className="max-h-80 overflow-auto p-4"><div className="grid gap-5 md:grid-cols-2">{Object.entries(grouped).map(([modulo, items]) => <section key={modulo}><h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">{modulo}</h3><div className="space-y-2">{items.map((p) => <label key={p.id} className="flex items-start gap-2 text-sm"><Checkbox checked={selected.includes(p.id)} onCheckedChange={(v) => toggle(p.id, Boolean(v))} /><span><span className="font-medium">{p.label}</span><span className="block text-xs text-muted-foreground">{p.name}</span></span></label>)}</div></section>)}</div></div></div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar"}</Button></div></form></DialogContent></Dialog>
}