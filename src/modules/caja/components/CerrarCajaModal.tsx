import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ArqueoCajaCard } from "@/modules/caja/components/ArqueoCajaCard"
import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { useCerrarCaja } from "@/modules/caja/hooks/useCajaMutations"
import { cerrarCajaSchema, type CerrarCajaFormValues } from "@/modules/caja/schemas/caja.schema"
import type { ArqueoCaja, Caja } from "@/modules/caja/types/caja.types"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

type Props = {
  caja: Caja
  arqueo: ArqueoCaja
  open: boolean
  onOpenChange: (open: boolean) => void
  onClosed?: (arqueo: ArqueoCaja) => void
}

export function CerrarCajaModal({ caja, arqueo, open, onOpenChange, onClosed }: Props) {
  const mutation = useCerrarCaja(caja.id)
  const form = useForm<CerrarCajaFormValues>({
    resolver: zodResolver(cerrarCajaSchema) as never,
    defaultValues: { monto_cierre_real: Number(arqueo.saldo_sistema ?? 0), observacion_cierre: "" },
  })
  const montoReal = form.watch("monto_cierre_real")
  const diferencia = useMemo(() => Number(montoReal ?? 0) - Number(arqueo.saldo_sistema ?? 0), [montoReal, arqueo.saldo_sistema])

  async function onSubmit(values: CerrarCajaFormValues) {
    try {
      const response = await mutation.mutateAsync({ ...values, observacion_cierre: values.observacion_cierre || null })
      toast.success("Caja cerrada correctamente.")
      onClosed?.(response.arqueo)
      onOpenChange(false)
    } catch (error) {
      Object.entries(getLaravelValidationErrors(error)).forEach(([field, messages]) => {
        form.setError(field as keyof CerrarCajaFormValues, { message: messages[0] })
      })
      toast.error(getLaravelErrorMessage(error, "No se pudo cerrar la caja."))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cerrar caja</DialogTitle>
          <DialogDescription>Revise el arqueo antes de confirmar el cierre.</DialogDescription>
        </DialogHeader>
        <ArqueoCajaCard arqueo={{ ...arqueo, monto_real: montoReal, diferencia }} />
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="monto_cierre_real"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Monto cierre real</FormLabel>
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
                  <p className="text-xs text-muted-foreground">Diferencia calculada: {formatCurrency(diferencia)}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observacion_cierre"
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
              <Button disabled={mutation.isPending} type="submit">Confirmar cierre</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
