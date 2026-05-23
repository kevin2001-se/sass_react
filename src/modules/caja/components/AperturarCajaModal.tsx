import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useAperturarCaja } from "@/modules/caja/hooks/useCajaMutations"
import { aperturarCajaSchema, type AperturarCajaFormValues } from "@/modules/caja/schemas/caja.schema"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export function AperturarCajaModal({ open, onOpenChange }: Props) {
  const mutation = useAperturarCaja()
  const form = useForm<AperturarCajaFormValues>({
    resolver: zodResolver(aperturarCajaSchema) as never,
    defaultValues: { monto_apertura: 0, observacion_apertura: "" },
  })

  async function onSubmit(values: AperturarCajaFormValues) {
    try {
      await mutation.mutateAsync({ ...values, observacion_apertura: values.observacion_apertura || null })
      toast.success("Caja aperturada correctamente.")
      form.reset()
      onOpenChange(false)
    } catch (error) {
      Object.entries(getLaravelValidationErrors(error)).forEach(([field, messages]) => {
        form.setError(field as keyof AperturarCajaFormValues, { message: messages[0] })
      })
      toast.error(getLaravelErrorMessage(error, "No se pudo aperturar la caja."))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aperturar caja</DialogTitle>
          <DialogDescription>La apertura se registrará para la tienda activa.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="monto_apertura"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Monto apertura</FormLabel>
                  <FormControl>
                    <Input
                      aria-invalid={!!fieldState.error}
                      className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      min="0"
                      step="0.01"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observacion_apertura"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Observación</FormLabel>
                  <FormControl>
                    <Textarea
                      aria-invalid={!!fieldState.error}
                      className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      placeholder="Opcional"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button disabled={mutation.isPending} type="submit">Aperturar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
