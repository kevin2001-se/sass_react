import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { useProductoConfiguracion } from "@/modules/productos/hooks/useProductoConfiguracion"
import type { ProductoFormValues } from "@/modules/productos/schemas/producto.schema"
import type { UnidadMedida } from "@/modules/productos/types/producto.types"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Separator } from "@/shared/components/ui/separator"
import { Switch } from "@/shared/components/ui/switch"
import { cn } from "@/shared/utils/cn"

type ProductoPresentacionesFormProps = {
  unidadesMedida: UnidadMedida[]
}

export function ProductoPresentacionesForm({ unidadesMedida }: ProductoPresentacionesFormProps) {
  const form = useFormContext<ProductoFormValues>()
  const configuracionQuery = useProductoConfiguracion()
  const autogenerarCodigoBarra = Boolean(configuracionQuery.data?.autogenerar_codigo_barra)
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "presentaciones",
  })

  function addPresentacion() {
    append({
      unidad_medida_id: 0,
      nombre: "",
      codigo_barra: autogenerarCodigoBarra ? null : "",
      factor_conversion: 1,
      precio_compra: null,
      precio_venta: 0,
      es_principal: fields.length === 0,
      estado: true,
    })
  }

  function markPrincipal(index: number, checked: boolean) {
    const presentaciones = form.getValues("presentaciones")

    presentaciones.forEach((presentacion, currentIndex) => {
      update(currentIndex, {
        ...presentacion,
        es_principal: checked ? currentIndex === index : currentIndex === index ? false : presentacion.es_principal,
      })
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Presentaciones</h3>
          <p className="text-xs text-muted-foreground">
            El stock se manejarÃ¡ en unidad mÃ­nima; las presentaciones convierten cantidades.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={addPresentacion}>
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      <FormField
        control={form.control}
        name="presentaciones"
        render={() => <FormMessage />}
      />

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div className="rounded-md border bg-background p-4" key={field.id}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-medium">PresentaciÃ³n {index + 1}</p>
              <Button
                disabled={fields.length === 1}
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                control={form.control}
                name={`presentaciones.${index}.nombre`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        aria-invalid={!!fieldState.error}
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                        placeholder="Caja x 100 unidades"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`presentaciones.${index}.unidad_medida_id`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Unidad de medida</FormLabel>
                    <FormControl>
                      <AppCombobox
                        value={field.value ? Number(field.value) : null}
                        onChange={(value) => field.onChange(value === null ? 0 : Number(value))}
                        options={unidadesMedida.map((unidad) => ({ value: unidad.id, label: unidad.nombre, description: unidad.simbolo }))}
                        placeholder="Seleccionar"
                        searchPlaceholder="Buscar unidad..."
                        emptyMessage="No se encontraron unidades"
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`presentaciones.${index}.codigo_barra`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>CÃ³digo de barra</FormLabel>
                    <FormControl>
                      <Input
                        aria-invalid={!!fieldState.error}
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                        disabled={autogenerarCodigoBarra}
                        placeholder={autogenerarCodigoBarra ? "Se generarÃ¡ automÃ¡ticamente" : "Opcional"}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    {autogenerarCodigoBarra && (
                      <p className="text-xs text-muted-foreground">
                        {field.value ? "CÃ³digo generado por el sistema." : "Se generarÃ¡ al guardar."}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`presentaciones.${index}.factor_conversion`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Factor conversiÃ³n</FormLabel>
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
                name={`presentaciones.${index}.precio_compra`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Precio compra</FormLabel>
                    <FormControl>
                      <Input
                        aria-invalid={!!fieldState.error}
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                        min="0"
                        step="0.01"
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`presentaciones.${index}.precio_venta`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Precio venta</FormLabel>
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
            </div>

            <Separator className="my-4" />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name={`presentaciones.${index}.es_principal`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-md border p-3">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(checked) => markPrincipal(index, Boolean(checked))} />
                    </FormControl>
                    <FormLabel className="font-normal">PresentaciÃ³n principal</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`presentaciones.${index}.estado`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                    <FormLabel className="font-normal">Activa</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

