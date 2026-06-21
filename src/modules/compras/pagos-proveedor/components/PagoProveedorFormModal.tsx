import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { useCuentasPagar } from "@/modules/compras/cuentas-pagar/hooks/useCuentasPagar"
import type { CuentaPagar } from "@/modules/compras/cuentas-pagar/types/cuentaPagar.types"
import { usePagoProveedorMutations } from "@/modules/compras/pagos-proveedor/hooks/usePagoProveedorMutations"
import { pagoProveedorSchema } from "@/modules/compras/pagos-proveedor/schemas/pagoProveedor.schema"
import type { PagoProveedor, PagoProveedorFormValues } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"
import { getLaravelErrorMessage } from "@/shared/services/api"

function today() { return new Date().toISOString().slice(0, 10) }
function money(value?: number | string | null) { return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(value ?? 0)) }
function saldo(cuenta?: CuentaPagar | null) { return Number(cuenta?.saldo_pendiente ?? cuenta?.saldo ?? 0) }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  cuentaInicial?: CuentaPagar | null
  onCreated?: (pago: PagoProveedor) => void
}

export function PagoProveedorFormModal({ open, onOpenChange, cuentaInicial, onCreated }: Props) {
  const cuentasQuery = useCuentasPagar({ per_page: 50 })
  const mutations = usePagoProveedorMutations()
  const cuentas = useMemo(() => {
    const list = cuentasQuery.data?.data ?? []
    const merged = cuentaInicial && !list.some((item) => item.id === cuentaInicial.id) ? [cuentaInicial, ...list] : list
    return merged.filter((cuenta) => saldo(cuenta) > 0 && !["PAGADO", "PAGADA", "ANULADO", "ANULADA"].includes(cuenta.estado))
  }, [cuentaInicial, cuentasQuery.data?.data])

  const form = useForm<PagoProveedorFormValues>({
    resolver: zodResolver(pagoProveedorSchema) as any,
    defaultValues: { cuenta_por_pagar_id: cuentaInicial?.id ?? null, metodo_pago: "EFECTIVO", monto: saldo(cuentaInicial), fecha_pago: today(), referencia: "", observacion: "" },
  })
  const selectedCuentaId = form.watch("cuenta_por_pagar_id")
  const selectedCuenta = cuentas.find((cuenta) => String(cuenta.id) === String(selectedCuentaId)) ?? cuentaInicial

  useEffect(() => {
    if (!open) return
    form.reset({ cuenta_por_pagar_id: cuentaInicial?.id ?? null, metodo_pago: "EFECTIVO", monto: saldo(cuentaInicial), fecha_pago: today(), referencia: "", observacion: "" })
  }, [cuentaInicial, form, open])

  useEffect(() => {
    if (selectedCuenta && Number(form.getValues("monto") || 0) === 0) form.setValue("monto", saldo(selectedCuenta))
  }, [form, selectedCuenta])

  async function submit(values: PagoProveedorFormValues) {
    const cuenta = cuentas.find((item) => item.id === Number(values.cuenta_por_pagar_id)) ?? cuentaInicial
    if (cuenta && Number(values.monto) > saldo(cuenta)) {
      form.setError("monto", { message: "No puede pagar mas que el saldo pendiente" })
      return
    }

    try {
      const pago = await mutations.crear.mutateAsync(values)
      toast.success("Pago registrado correctamente")
      onCreated?.(pago)
      onOpenChange(false)
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo registrar el pago."))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar pago proveedor</DialogTitle>
          <DialogDescription>Reduce el saldo de una cuenta por pagar y registra egreso de caja.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
            <FormField control={form.control} name="cuenta_por_pagar_id" render={({ field, fieldState }) => (
              <FormItem><FormLabel>Cuenta por pagar</FormLabel><FormControl><AppCombobox value={field.value} onChange={(value) => { field.onChange(value ? Number(value) : null); const cuenta = cuentas.find((item) => String(item.id) === String(value)); form.setValue("monto", saldo(cuenta)) }} options={cuentas.map((cuenta) => ({ value: cuenta.id, label: `${cuenta.proveedor?.razon_social ?? "Proveedor"} - ${cuenta.compra?.numero_documento ?? `CxP #${cuenta.id}`}`, description: `Saldo ${money(cuenta.saldo_pendiente ?? cuenta.saldo)}` }))} placeholder="Seleccione cuenta" searchPlaceholder="Buscar cuenta..." emptyMessage="No hay cuentas pendientes" loading={cuentasQuery.isLoading} error={!!fieldState.error} /></FormControl><FormMessage /></FormItem>
            )} />
            {selectedCuenta ? <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">Saldo pendiente: <span className="font-semibold text-foreground">{money(selectedCuenta.saldo_pendiente ?? selectedCuenta.saldo)}</span></div> : null}
            <div className="grid gap-4 md:grid-cols-3">
              <FormField control={form.control} name="metodo_pago" render={({ field }) => <FormItem><FormLabel>Metodo</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="EFECTIVO">Efectivo</SelectItem><SelectItem value="YAPE">Yape</SelectItem><SelectItem value="PLIN">Plin</SelectItem><SelectItem value="TARJETA">Tarjeta</SelectItem><SelectItem value="TRANSFERENCIA">Transferencia</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
              <FormField control={form.control} name="monto" render={({ field, fieldState }) => <FormItem><FormLabel>Monto</FormLabel><FormControl><Input type="number" step="0.01" min="0" {...field} aria-invalid={!!fieldState.error} className={fieldState.error ? "border-destructive focus-visible:ring-destructive" : undefined} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="fecha_pago" render={({ field, fieldState }) => <FormItem><FormLabel>Fecha pago</FormLabel><FormControl><Input type="date" {...field} aria-invalid={!!fieldState.error} className={fieldState.error ? "border-destructive focus-visible:ring-destructive" : undefined} /></FormControl><FormMessage /></FormItem>} />
            </div>
            <FormField control={form.control} name="referencia" render={({ field }) => <FormItem><FormLabel>Referencia</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="Operacion, voucher, transferencia" /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="observacion" render={({ field }) => <FormItem><FormLabel>Observacion</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={mutations.crear.isPending}>{mutations.crear.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Registrar pago</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}