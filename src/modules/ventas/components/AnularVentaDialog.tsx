import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { useAnularVenta } from "@/modules/ventas/hooks/useAnularVenta"
import type { Venta } from "@/modules/ventas/types/venta.types"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Textarea } from "@/shared/components/ui/textarea"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

const anularVentaSchema = z.object({
  motivo: z.string().trim().min(3, "Ingrese un motivo de al menos 3 caracteres.").max(255, "El motivo no puede superar 255 caracteres."),
})

type AnularVentaValues = z.infer<typeof anularVentaSchema>

type AnularVentaDialogProps = {
  venta: Venta
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnularVentaDialog({ venta, open, onOpenChange }: AnularVentaDialogProps) {
  const mutation = useAnularVenta()
  const form = useForm<AnularVentaValues>({
    resolver: zodResolver(anularVentaSchema),
    defaultValues: { motivo: "" },
  })

  useEffect(() => {
    if (open) {
      form.reset({ motivo: "" })
    }
  }, [form, open])

  async function onSubmit(values: AnularVentaValues) {
    try {
      await mutation.mutateAsync({ id: venta.id, payload: values })
      toast.success("Venta anulada correctamente.")
      onOpenChange(false)
    } catch (error) {
      const errors = getLaravelValidationErrors(error)
      Object.entries(errors).forEach(([field, messages]) => {
        if (field === "motivo" || field === "venta") {
          form.setError(field === "motivo" ? "motivo" : "root", { message: messages[0] })
        }
      })
      toast.error(getLaravelErrorMessage(error, "No se pudo anular la venta."))
    }
  }

  return (
    <Dialog open={open} onOpenChange={mutation.isPending ? undefined : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Anular venta
          </DialogTitle>
          <DialogDescription>
            Esta acción devolverá stock y registrará el reverso en caja si la venta tuvo pagos.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <p className="font-medium">{venta.numero_comprobante}</p>
          <p className="text-muted-foreground">Total: S/ {Number(venta.total).toFixed(2)}</p>
        </div>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="motivo"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      aria-invalid={!!fieldState.error}
                      className={cn(fieldState.error && "input-invalid border-destructive focus-visible:ring-destructive")}
                      disabled={mutation.isPending}
                      placeholder="Ej. Error en la venta"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root?.message ? (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" disabled={mutation.isPending}>
                {mutation.isPending ? "Anulando..." : "Confirmar anulación"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}