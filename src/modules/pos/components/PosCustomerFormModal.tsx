import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { useCreatePosCustomer, useUpdatePosCustomer } from "@/modules/pos/hooks/usePosCustomerMutations"
import { posClienteSchema, type PosClienteFormValues } from "@/modules/pos/schemas/posCliente.schema"
import type { PosCliente, PosClientePayload, PosTipoDocumentoCliente } from "@/modules/pos/types/posCliente.types"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

const tipos: PosTipoDocumentoCliente[] = ["DNI", "RUC", "CE", "SIN_DOCUMENTO"]

function defaults(cliente?: PosCliente | null): PosClienteFormValues {
  return {
    tipo_documento: cliente?.tipo_documento ?? "DNI",
    numero_documento: cliente?.numero_documento ?? "",
    nombres: cliente?.nombres ?? "",
    razon_social: cliente?.razon_social ?? "",
    direccion: cliente?.direccion ?? "",
    telefono: cliente?.telefono ?? "",
    email: cliente?.email ?? "",
    estado: cliente?.estado ?? true,
  }
}

function normalizePayload(values: PosClienteFormValues): PosClientePayload {
  return {
    tipo_documento: values.tipo_documento,
    numero_documento: values.numero_documento || null,
    nombres: values.nombres?.trim() || values.razon_social?.trim() || "CLIENTE",
    razon_social: values.razon_social || null,
    direccion: values.direccion || null,
    telefono: values.telefono || null,
    email: values.email || null,
    estado: true,
  }
}

export function PosCustomerFormModal({
  open,
  cliente,
  onOpenChange,
  onSaved,
}: {
  open: boolean
  cliente?: PosCliente | null
  onOpenChange: (open: boolean) => void
  onSaved: (cliente: PosCliente) => void
}) {
  const createMutation = useCreatePosCustomer()
  const updateMutation = useUpdatePosCustomer(cliente?.id)
  const loading = createMutation.isPending || updateMutation.isPending
  const form = useForm<PosClienteFormValues>({
    resolver: zodResolver(posClienteSchema) as never,
    defaultValues: defaults(cliente),
  })
  const tipoDocumento = form.watch("tipo_documento")

  useEffect(() => {
    if (open) form.reset(defaults(cliente))
  }, [cliente, form, open])

  async function submit(values: PosClienteFormValues) {
    try {
      const payload = normalizePayload(values)
      const saved = cliente?.id
        ? await updateMutation.mutateAsync(payload)
        : await createMutation.mutateAsync(payload)
      toast.success(cliente?.id ? "Cliente actualizado." : "Cliente creado.")
      onSaved(saved)
      onOpenChange(false)
    } catch (error) {
      const errors = getLaravelValidationErrors(error)
      Object.entries(errors).forEach(([field, messages]) => {
        form.setError(field as keyof PosClienteFormValues, { type: "server", message: messages[0] })
      })
      toast.error(getLaravelErrorMessage(error, "No se pudo guardar el cliente."))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{cliente?.id ? "Editar cliente" : "Nuevo cliente rapido"}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
            <FormField
              control={form.control}
              name="tipo_documento"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Tipo documento</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger aria-invalid={!!fieldState.error}>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipos.map((tipo) => <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <TextField name="numero_documento" label="Numero documento" placeholder="Documento" />
              <TextField name="telefono" label="Telefono" placeholder="Telefono" />
            </div>

            {(tipoDocumento === "DNI" || tipoDocumento === "CE" || tipoDocumento === "SIN_DOCUMENTO") && (
              <TextField name="nombres" label="Nombres" placeholder="Nombres del cliente" />
            )}

            {tipoDocumento === "RUC" && (
              <TextField name="razon_social" label="Razon social" placeholder="Razon social" />
            )}

            <TextField name="email" label="Email" placeholder="cliente@correo.com" />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Direccion</FormLabel>
                  <FormControl>
                    <Textarea
                      aria-invalid={!!fieldState.error}
                      className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      placeholder="Direccion opcional"
                      {...field}
                      value={String(field.value ?? "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button disabled={loading} type="submit">{loading ? "Guardando..." : "Guardar cliente"}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

function TextField({ name, label, placeholder }: { name: keyof PosClienteFormValues; label: string; placeholder?: string }) {
  const form = useFormContextSafe()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!fieldState.error}
              className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
              placeholder={placeholder}
              {...field}
              value={String(field.value ?? "")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function useFormContextSafe() {
  return useFormContext<PosClienteFormValues>()
}


