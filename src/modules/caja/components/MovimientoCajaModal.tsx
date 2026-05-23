import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useRegistrarEgresoCaja, useRegistrarIngresoCaja } from "@/modules/caja/hooks/useCajaMutations"
import { registrarMovimientoCajaSchema, type RegistrarMovimientoCajaFormValues } from "@/modules/caja/schemas/caja.schema"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

type Props = {
  mode: "ingreso" | "egreso"
  open: boolean
  onOpenChange: (open: boolean) => void
}

const metodos = ["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"] as const

export function MovimientoCajaModal({ mode, open, onOpenChange }: Props) {
  const ingresoMutation = useRegistrarIngresoCaja()
  const egresoMutation = useRegistrarEgresoCaja()
  const mutation = mode === "ingreso" ? ingresoMutation : egresoMutation
  const form = useForm<RegistrarMovimientoCajaFormValues>({
    resolver: zodResolver(registrarMovimientoCajaSchema) as never,
    defaultValues: { metodo_pago: "EFECTIVO", concepto: "", monto: 0, observacion: "" },
  })

  async function onSubmit(values: RegistrarMovimientoCajaFormValues) {
    try {
      await mutation.mutateAsync({ ...values, observacion: values.observacion || null })
      toast.success(`${mode === "ingreso" ? "Ingreso" : "Egreso"} registrado correctamente.`)
      form.reset({ metodo_pago: "EFECTIVO", concepto: "", monto: 0, observacion: "" })
      onOpenChange(false)
    } catch (error) {
      Object.entries(getLaravelValidationErrors(error)).forEach(([field, messages]) => {
        form.setError(field as keyof RegistrarMovimientoCajaFormValues, { message: messages[0] })
      })
      toast.error(getLaravelErrorMessage(error, `No se pudo registrar el ${mode}.`))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar {mode}</DialogTitle>
          <DialogDescription>El movimiento afectará la caja abierta de la tienda activa.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="metodo_pago"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Método de pago</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}>
                        <SelectValue placeholder="Seleccione método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {metodos.map((metodo) => <SelectItem key={metodo} value={metodo}>{metodo}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="concepto"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Concepto</FormLabel>
                  <FormControl>
                    <Input aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monto"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      aria-invalid={!!fieldState.error}
                      className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      min="0.01"
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
              name="observacion"
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
              <Button disabled={mutation.isPending} type="submit">Registrar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
