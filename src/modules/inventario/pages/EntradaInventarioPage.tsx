import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { InventarioMovimientoForm } from "@/modules/inventario/components/InventarioMovimientoForm"
import { useCreateLote, useEntradaInventario } from "@/modules/inventario/hooks/useInventarioMutations"
import { useLotes } from "@/modules/inventario/hooks/useLotes"
import { loteSchema, type LoteFormValues } from "@/modules/inventario/schemas/inventario.schema"
import { useProductos } from "@/modules/productos/hooks/useProductos"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Switch } from "@/shared/components/ui/switch"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

export function EntradaInventarioPage() {
  const productosQuery = useProductos({ per_page: 100, estado: "true" })
  const lotesQuery = useLotes({ estado: "true", per_page: 100 })
  const entradaMutation = useEntradaInventario()
  const createLoteMutation = useCreateLote()
  const [quickLoteOpen, setQuickLoteOpen] = useState(false)
  const loteForm = useForm<LoteFormValues>({
    resolver: zodResolver(loteSchema) as never,
    defaultValues: { producto_id: 0, codigo_lote: "", fecha_vencimiento: "", estado: true },
  })

  async function onSubmit(values: Parameters<typeof entradaMutation.mutateAsync>[0]) {
    try {
      await entradaMutation.mutateAsync(values)
      toast.success("Entrada de inventario registrada correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo registrar la entrada."))
      throw error
    }
  }

  async function onCreateQuickLote(values: LoteFormValues) {
    try {
      await createLoteMutation.mutateAsync({
        ...values,
        fecha_vencimiento: values.fecha_vencimiento || null,
      })
      toast.success("Lote creado correctamente.")
      setQuickLoteOpen(false)
      loteForm.reset({ producto_id: 0, codigo_lote: "", fecha_vencimiento: "", estado: true })
    } catch (error) {
      const errors = getLaravelValidationErrors(error)
      Object.entries(errors).forEach(([field, messages]) => {
        loteForm.setError(field as keyof LoteFormValues, { message: messages[0] })
      })
      toast.error(getLaravelErrorMessage(error, "No se pudo crear el lote."))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Entrada de inventario</h1>
        <p className="text-sm text-muted-foreground">Suma stock en unidad mínima usando la conversión de presentación.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar entrada</CardTitle>
          <CardDescription>Puede usarse para compras, ingresos iniciales o devoluciones.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventarioMovimientoForm
            isSubmitting={entradaMutation.isPending}
            lotes={lotesQuery.data?.data ?? []}
            mode="entrada"
            productos={productosQuery.data?.data ?? []}
            onQuickCreateLote={() => setQuickLoteOpen(true)}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>

      <Dialog open={quickLoteOpen} onOpenChange={setQuickLoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear lote rápido</DialogTitle>
            <DialogDescription>El lote se creara para la empresa. El stock se asociara a la tienda activa al registrar la entrada.</DialogDescription>
          </DialogHeader>
          <Form {...loteForm}>
            <form className="space-y-4" onSubmit={loteForm.handleSubmit(onCreateQuickLote)}>
              <FormField
                control={loteForm.control}
                name="producto_id"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Producto</FormLabel>
                    <FormControl>
                      <AppCombobox
                        value={field.value ? Number(field.value) : null}
                        onChange={(value) => field.onChange(value === null ? 0 : Number(value))}
                        options={(productosQuery.data?.data ?? []).map((producto) => ({ value: producto.id, label: producto.nombre, description: producto.codigo_interno }))}
                        placeholder="Seleccione producto"
                        searchPlaceholder="Buscar producto..."
                        emptyMessage="No se encontraron productos"
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loteForm.control}
                name="codigo_lote"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Código de lote</FormLabel>
                    <FormControl>
                      <Input aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loteForm.control}
                name="fecha_vencimiento"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Fecha de vencimiento</FormLabel>
                    <FormControl>
                      <Input
                        aria-invalid={!!fieldState.error}
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loteForm.control}
                name="estado"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                    <FormLabel>Activo</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setQuickLoteOpen(false)}>Cancelar</Button>
                <Button disabled={createLoteMutation.isPending} type="submit">Guardar lote</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
