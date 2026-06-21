import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/shared/utils/cn"
import { useAnularPagoCliente } from "../hooks/useRegistrarPagoCliente"
import { anularPagoClienteSchema, type AnularPagoClienteFormValues } from "../schemas/pagoCliente.schema"
import type { PagoCliente } from "../types/cuentaCobrar.types"
export function AnularPagoClienteDialog({ pago, open, onOpenChange }: { pago?: PagoCliente | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const mutation = useAnularPagoCliente()
  const form = useForm<AnularPagoClienteFormValues>({ resolver: zodResolver(anularPagoClienteSchema), defaultValues: { motivo: "" } })
  useEffect(() => { if (open) form.reset({ motivo: "" }) }, [open, form])
  const submit = form.handleSubmit(async (values) => { if (!pago) return; await mutation.mutateAsync({ id: pago.id, payload: values }); onOpenChange(false) })
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Anular pago de cliente</DialogTitle></DialogHeader><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label>Motivo</Label><Textarea rows={3} className={cn(form.formState.errors.motivo && "input-invalid")} {...form.register("motivo")} />{form.formState.errors.motivo && <p className="text-sm text-red-600">{form.formState.errors.motivo.message}</p>}</div><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Anular pago</Button></DialogFooter></form></DialogContent></Dialog>
}
