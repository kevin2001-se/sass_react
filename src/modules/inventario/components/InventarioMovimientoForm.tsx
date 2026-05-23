import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { inventarioAjusteSchema, inventarioMovimientoSchema } from "@/modules/inventario/schemas/inventario.schema"
import type { Lote } from "@/modules/inventario/types/inventario.types"
import { useProducto } from "@/modules/productos/hooks/useProducto"
import type { Producto } from "@/modules/productos/types/producto.types"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { getLaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

type MovimientoMode = "entrada" | "salida" | "ajuste"
type MovimientoValues = z.infer<typeof inventarioMovimientoSchema> & { tipo_ajuste: "POSITIVO" | "NEGATIVO" }

type InventarioMovimientoFormProps = {
  mode: MovimientoMode
  productos: Producto[]
  lotes: Lote[]
  isSubmitting?: boolean
  onSubmit: (values: MovimientoValues) => void | Promise<void>
  onQuickCreateLote?: () => void
}

export function InventarioMovimientoForm({
  mode,
  productos,
  lotes,
  isSubmitting,
  onSubmit,
  onQuickCreateLote,
}: InventarioMovimientoFormProps) {
  const schema = mode === "ajuste" ? inventarioAjusteSchema : inventarioMovimientoSchema
  const form = useForm<MovimientoValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      producto_id: 0,
      producto_presentacion_id: 0,
      lote_id: null,
      tipo_ajuste: "POSITIVO",
      cantidad_presentacion: 1,
      motivo: "",
      observacion: "",
    },
  })
  const productoId = form.watch("producto_id")
  const productoResumen = productos.find((item) => item.id === Number(productoId))
  const productoDetalleQuery = useProducto(productoId ? Number(productoId) : undefined)
  const producto = productoDetalleQuery.data ?? productoResumen
  const presentaciones = producto?.presentaciones ?? []
  const tipoAjuste = form.watch("tipo_ajuste")
  const shouldRequireStockInSelectedStore = mode === "salida" || (mode === "ajuste" && tipoAjuste === "NEGATIVO")
  const productoLotes = useMemo(
    () => lotes.filter((lote) => {
      if (lote.producto_id !== Number(productoId) || !lote.estado) return false
      if (!shouldRequireStockInSelectedStore) return true

      return Number(lote.stock?.cantidad_actual ?? 0) > 0
    }),
    [lotes, productoId, shouldRequireStockInSelectedStore],
  )
  const lotesFefo = useMemo(
    () => [...productoLotes].sort((a, b) => String(a.fecha_vencimiento ?? "9999-12-31").localeCompare(String(b.fecha_vencimiento ?? "9999-12-31"))),
    [productoLotes],
  )
  const requiresLote = Boolean(producto?.maneja_lote)
  const loadingPresentaciones = Boolean(productoId && productoDetalleQuery.isFetching)

  async function handleSubmit(values: MovimientoValues) {
    try {
      await onSubmit({
        ...values,
        lote_id: requiresLote ? values.lote_id : null,
      })
      form.reset({
        producto_id: 0,
        producto_presentacion_id: 0,
        lote_id: null,
        tipo_ajuste: "POSITIVO",
        cantidad_presentacion: 1,
        motivo: "",
        observacion: "",
      })
    } catch (error) {
      const errors = getLaravelValidationErrors(error)
      Object.entries(errors).forEach(([field, messages]) => {
        form.setError(field as keyof MovimientoValues, { message: messages[0] })
      })
      throw error
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="producto_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Producto</FormLabel>
                  <FormControl>
                    <AppCombobox
                      value={field.value ? Number(field.value) : null}
                      onChange={(value) => {
                        field.onChange(value === null ? 0 : Number(value))
                        form.setValue("producto_presentacion_id", 0)
                        form.setValue("lote_id", null)
                      }}
                      options={productos.map((item) => ({ value: item.id, label: item.nombre, description: item.codigo_interno }))}
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
              control={form.control}
              name="producto_presentacion_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>PresentaciÃ³n</FormLabel>
                  <FormControl>
                    <AppCombobox
                      disabled={!producto || loadingPresentaciones || presentaciones.length === 0}
                      loading={loadingPresentaciones}
                      value={field.value ? Number(field.value) : null}
                      onChange={(value) => field.onChange(value === null ? 0 : Number(value))}
                      options={presentaciones.filter((presentacion) => presentacion.id !== undefined).map((presentacion) => ({ value: Number(presentacion.id), label: presentacion.nombre, description: `Factor ${presentacion.factor_conversion}` }))}
                      placeholder={loadingPresentaciones ? "Cargando presentaciones..." : "Seleccione presentación"}
                      searchPlaceholder="Buscar presentación..."
                      emptyMessage="No se encontraron presentaciones"
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  {producto && !loadingPresentaciones && presentaciones.length === 0 && (
                    <p className="text-xs text-muted-foreground">Este producto no tiene presentaciones activas disponibles.</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "ajuste" && (
              <FormField
                control={form.control}
                name="tipo_ajuste"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Tipo de ajuste</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="POSITIVO">Positivo</SelectItem>
                        <SelectItem value="NEGATIVO">Negativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="lote_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-3">
                    <FormLabel>Lote {requiresLote ? "" : "(no aplica)"}</FormLabel>
                    {requiresLote && onQuickCreateLote && (
                      <Button size="sm" type="button" variant="ghost" onClick={onQuickCreateLote}>
                        Crear lote rÃ¡pido
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <AppCombobox
                      disabled={!requiresLote}
                      value={field.value ? Number(field.value) : null}
                      onChange={(value) => field.onChange(value === null ? null : Number(value))}
                      options={lotesFefo.map((lote, index) => ({
                        value: lote.id,
                        label: lote.codigo_lote,
                        description: `${lote.fecha_vencimiento ? `vence ${lote.fecha_vencimiento}` : "Sin vencimiento"} - stock tienda ${lote.stock?.cantidad_actual ?? 0} ${shouldRequireStockInSelectedStore && index === 0 ? "(FEFO)" : ""}`,
                      }))}
                      placeholder={requiresLote ? "Seleccione lote" : "Sin lote"}
                      searchPlaceholder="Buscar lote..."
                      emptyMessage="No se encontraron lotes"
                      error={!!fieldState.error}
                      allowClear={!requiresLote}
                    />
                  </FormControl>
                  {shouldRequireStockInSelectedStore && requiresLote && lotesFefo.length > 0 && (
                    <p className="text-xs text-muted-foreground">Sugerencia FEFO: usar primero {lotesFefo[0].codigo_lote} con stock en la tienda activa.</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cantidad_presentacion"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
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
              name="motivo"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Input
                      aria-invalid={!!fieldState.error}
                      className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      placeholder="Ej. Compra inicial, merma, ajuste fÃ­sico"
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
                <FormItem className="md:col-span-2">
                  <FormLabel>ObservaciÃ³n</FormLabel>
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
          </CardContent>
        </Card>

        {requiresLote && !lotesFefo.length && (
          <Alert>
            <AlertTitle>Producto con lote</AlertTitle>
            <AlertDescription>{shouldRequireStockInSelectedStore ? "Este producto requiere un lote con stock en la tienda activa." : "Este producto requiere lote. Cree uno para la empresa antes de registrar el movimiento."}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button disabled={isSubmitting} type="submit">
            Registrar {mode}
          </Button>
        </div>
      </form>
    </Form>
  )
}


