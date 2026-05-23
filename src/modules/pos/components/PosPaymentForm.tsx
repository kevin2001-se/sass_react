import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import type { PosMetodoPago } from "@/modules/pos/types/pos.types"
import { formatMetodoPago } from "@/modules/pos/utils/posPaymentCalculations"
import { Button } from "@/shared/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { cn } from "@/shared/utils/cn"

const metodos: PosMetodoPago[] = ["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"]

const paymentSchema = z.object({
  metodo_pago: z.enum(["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA"]),
  monto: z.coerce.number().gt(0, "El monto debe ser mayor a 0."),
  referencia: z.string().nullable().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

export function PosPaymentForm({
  metodoInicial,
  onSubmitted,
}: {
  metodoInicial?: PosMetodoPago | null
  onSubmitted?: () => void
}) {
  const addPago = usePosStore((state) => state.addPago)
  const saldoPendiente = usePosStore((state) => state.saldoPendiente)
  const total = usePosStore((state) => state.total)
  const tipoVenta = usePosStore((state) => state.tipoVenta)
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as never,
    defaultValues: {
      metodo_pago: metodoInicial ?? "EFECTIVO",
      monto: saldoPendiente || total || 0,
      referencia: "",
    },
  })
  const metodo = form.watch("metodo_pago")

  useEffect(() => {
    if (metodoInicial) form.setValue("metodo_pago", metodoInicial)
    form.setValue("monto", Number((saldoPendiente || total || 0).toFixed(2)))
  }, [form, metodoInicial, saldoPendiente, total])

  function submit(values: PaymentFormValues) {
    const result = addPago({
      id: `${values.metodo_pago}-${Date.now()}`,
      metodo_pago: values.metodo_pago,
      monto: values.monto,
      referencia: values.referencia || null,
    })

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    const current = usePosStore.getState()
    toast.success(current.puedeCobrar ? "Pago completo. Listo para registrar venta." : "Pago agregado.")
    form.reset({ metodo_pago: values.metodo_pago, monto: current.saldoPendiente, referencia: "" })
    onSubmitted?.()
  }

  return (
    <FormProvider {...form}>
      <form className="space-y-3 rounded-md border p-3" onSubmit={form.handleSubmit(submit)}>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="metodo_pago"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Metodo</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger aria-invalid={!!fieldState.error}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {metodos.map((item) => <SelectItem key={item} value={item}>{formatMetodoPago(item)}</SelectItem>)}
                  </SelectContent>
                </Select>
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
                    inputMode="decimal"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") form.reset()
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {metodo !== "EFECTIVO" && (
          <FormField
            control={form.control}
            name="referencia"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Referencia</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!fieldState.error}
                    className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                    placeholder="Operacion, voucher o codigo"
                    {...field}
                    value={String(field.value ?? "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button className="w-full" disabled={total <= 0} type="submit">
          Agregar pago {tipoVenta === "CREDITO" ? "inicial" : ""}
        </Button>
      </form>
    </FormProvider>
  )
}
