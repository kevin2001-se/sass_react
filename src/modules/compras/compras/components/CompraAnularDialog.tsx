import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import type { Compra } from "@/modules/compras/compras/types/compra.types"

const schema = z.object({ motivo: z.string().trim().min(3, "Ingrese un motivo") })
type FormValues = z.infer<typeof schema>

type CompraAnularDialogProps = { open: boolean; compra: Compra | null; loading?: boolean; onOpenChange: (open: boolean) => void; onConfirm: (values: FormValues) => void }

export function CompraAnularDialog({ open, compra, loading, onOpenChange, onConfirm }: CompraAnularDialogProps) {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { motivo: "" } })

  useEffect(() => { if (open) form.reset({ motivo: "" }) }, [form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anular compra</DialogTitle>
          <DialogDescription>Se registrara un movimiento inverso de inventario para {compra?.numero_documento}.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onConfirm)}>
          <div className="space-y-2">
            <Label>Motivo</Label>
            <Textarea rows={4} {...form.register("motivo")} aria-invalid={!!form.formState.errors.motivo} />
            {form.formState.errors.motivo?.message && <p className="text-sm text-destructive">{form.formState.errors.motivo.message}</p>}
          </div>
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit" variant="destructive" disabled={loading}>{loading ? "Anulando..." : "Confirmar anulacion"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
