import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Textarea } from "@/shared/components/ui/textarea"
import { anularPagoProveedorSchema } from "@/modules/compras/pagos-proveedor/schemas/pagoProveedor.schema"
import type { AnularPagoProveedorPayload, PagoProveedor } from "@/modules/compras/pagos-proveedor/types/pagoProveedor.types"

type Props = { open: boolean; pago?: PagoProveedor | null; loading?: boolean; onOpenChange: (open: boolean) => void; onConfirm: (values: AnularPagoProveedorPayload) => void }

export function PagoProveedorAnularDialog({ open, pago, loading, onOpenChange, onConfirm }: Props) {
  const form = useForm<AnularPagoProveedorPayload>({ resolver: zodResolver(anularPagoProveedorSchema), defaultValues: { motivo: "" } })
  useEffect(() => { if (open) form.reset({ motivo: "" }) }, [form, open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Anular pago proveedor</DialogTitle><DialogDescription>Se revertira el saldo de la cuenta y se registrara el movimiento inverso en caja.</DialogDescription></DialogHeader>
        <Form {...form}><form className="space-y-4" onSubmit={form.handleSubmit(onConfirm)}>
          <p className="text-sm text-muted-foreground">Pago #{pago?.id ?? ""}</p>
          <FormField control={form.control} name="motivo" render={({ field, fieldState }) => <FormItem><FormLabel>Motivo</FormLabel><FormControl><Textarea {...field} aria-invalid={!!fieldState.error} className={fieldState.error ? "border-destructive focus-visible:ring-destructive" : undefined} /></FormControl><FormMessage /></FormItem>} />
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit" variant="destructive" disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Anular</Button></DialogFooter>
        </form></Form>
      </DialogContent>
    </Dialog>
  )
}