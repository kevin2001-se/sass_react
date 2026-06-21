import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/shared/utils/cn"
import { useRegistrarPagoCliente } from "../hooks/useRegistrarPagoCliente"
import { pagoClienteSchema, type PagoClienteFormValues } from "../schemas/pagoCliente.schema"
import type { CuentaCobrar } from "../types/cuentaCobrar.types"
import { getSaldoCuenta } from "../types/cuentaCobrar.types"
function today() { return new Date().toISOString().slice(0, 10) }
export function RegistrarPagoClienteModal({ cuenta, open, onOpenChange }: { cuenta?: CuentaCobrar | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const mutation = useRegistrarPagoCliente(cuenta?.id)
  const saldo = cuenta ? getSaldoCuenta(cuenta) : 0
  const form = useForm<PagoClienteFormValues>({ resolver: zodResolver(pagoClienteSchema.refine((v) => v.monto <= saldo, { path: ["monto"], message: "El pago no puede superar el saldo." })), defaultValues: { metodo_pago: "EFECTIVO", monto: saldo, fecha_pago: today(), referencia: "", observacion: "" } })
  useEffect(() => { if (open) form.reset({ metodo_pago: "EFECTIVO", monto: saldo, fecha_pago: today(), referencia: "", observacion: "" }) }, [open, saldo, form])
  const submit = form.handleSubmit(async (values) => { await mutation.mutateAsync(values); onOpenChange(false) })
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Registrar pago de cliente</DialogTitle></DialogHeader><form onSubmit={submit} className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Metodo</Label><Select value={form.watch("metodo_pago")} onValueChange={(v) => form.setValue("metodo_pago", v as PagoClienteFormValues["metodo_pago"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="EFECTIVO">Efectivo</SelectItem><SelectItem value="YAPE">Yape</SelectItem><SelectItem value="PLIN">Plin</SelectItem><SelectItem value="TARJETA">Tarjeta</SelectItem><SelectItem value="TRANSFERENCIA">Transferencia</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Monto</Label><Input type="number" step="0.01" className={cn(form.formState.errors.monto && "input-invalid")} {...form.register("monto", { valueAsNumber: true })} />{form.formState.errors.monto && <p className="text-sm text-red-600">{form.formState.errors.monto.message}</p>}</div><div className="space-y-2"><Label>Fecha pago</Label><Input type="date" className={cn(form.formState.errors.fecha_pago && "input-invalid")} {...form.register("fecha_pago")} /></div><div className="space-y-2"><Label>Referencia</Label><Input {...form.register("referencia")} /></div></div><div className="space-y-2"><Label>Observacion</Label><Textarea rows={3} {...form.register("observacion")} /></div><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Registrar pago</Button></DialogFooter></form></DialogContent></Dialog>
}
