import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { guiaRemisionService, type GuiaCatalogo } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"
import type { GuiaRemisionFormValues } from "@/modules/comprobantes/guias-remision/schemas/guiaRemision.schema"
import { AppAsyncCombobox } from "@/shared/components/forms/AppAsyncCombobox"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/shared/utils/cn"

export function GuiaRemisionDetalleForm({ unidades }: { unidades: GuiaCatalogo[] }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "detalles" })
  const unidadOptions = unidades.map((unidad) => ({ value: unidad.codigo, label: `${unidad.codigo} - ${unidad.descripcion}` }))

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Detalles</CardTitle>
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ producto_id: null, descripcion: "", unidad_medida: "NIU", cantidad: 1, peso: null })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar detalle
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div className="rounded-md border p-4" key={field.id}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Item {index + 1}</p>
              <Button disabled={fields.length === 1} type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              <ProductField index={index} />
              <div className="lg:col-span-3">
                <FormField
                  control={form.control}
                  name={`detalles.${index}.descripcion`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Descripcion</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          aria-invalid={!!fieldState.error}
                          className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                          placeholder="PARACETAMOL 500MG"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`detalles.${index}.unidad_medida`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Unidad medida</FormLabel>
                    <FormControl>
                      <AppCombobox
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? "")}
                        options={unidadOptions}
                        placeholder="Seleccione unidad"
                        searchPlaceholder="Buscar unidad..."
                        error={!!fieldState.error}
                        allowClear={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <NumberField name={`detalles.${index}.cantidad`} label="Cantidad" min="0.0001" step="0.0001" />
              <NumberField name={`detalles.${index}.peso`} label="Peso" min="0" step="0.001" />
            </div>
          </div>
        ))}
        {form.formState.errors.detalles?.root?.message ? <p className="text-sm font-medium text-destructive">{form.formState.errors.detalles.root.message}</p> : null}
      </CardContent>
    </Card>
  )
}

function ProductField({ index }: { index: number }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  const [query, setQuery] = useState("")
  const productos = useQuery({
    queryKey: ["guia-productos", query],
    queryFn: () => guiaRemisionService.searchProductos(query),
    enabled: query.trim().length >= 2,
  })
  const options = (productos.data ?? []).map((producto) => ({ value: producto.id, label: producto.nombre, description: producto.codigo_interno ?? undefined }))

  return (
    <FormField
      control={form.control}
      name={`detalles.${index}.producto_id`}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Producto opcional</FormLabel>
          <FormControl>
            <AppAsyncCombobox
              value={field.value}
              onChange={field.onChange}
              options={options}
              onSearch={setQuery}
              loading={productos.isFetching}
              placeholder="Sin producto"
              searchPlaceholder="Buscar producto..."
              emptyMessage="No se encontraron productos"
              error={!!fieldState.error}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function NumberField({ name, label, min, step }: { name: `detalles.${number}.cantidad` | `detalles.${number}.peso`; label: string; min: string; step: string }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={min}
              step={step}
              value={field.value ?? ""}
              onChange={(event) => field.onChange(event.target.value)}
              aria-invalid={!!fieldState.error}
              className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
