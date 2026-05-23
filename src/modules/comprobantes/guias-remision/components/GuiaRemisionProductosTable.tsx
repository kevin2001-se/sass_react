import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { guiaRemisionService, type GuiaCatalogo, type ProductoOption } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"
import type { GuiaRemisionFormValues } from "@/modules/comprobantes/guias-remision/schemas/guiaRemision.schema"
import { AppAsyncCombobox } from "@/shared/components/forms/AppAsyncCombobox"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FormControl, FormField, FormItem, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { cn } from "@/shared/utils/cn"

export function GuiaRemisionProductosTable({ unidades }: { unidades: GuiaCatalogo[] }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "detalles" })
  const unidadOptions = unidades.map((unidad) => ({ value: unidad.codigo, label: `${unidad.codigo} - ${unidad.descripcion}` }))

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Productos trasladados</CardTitle>
        <Button type="button" variant="outline" onClick={() => append({ producto_id: null, descripcion: "", unidad_medida: "NIU", cantidad: 1, peso: null })}>
          <Plus className="mr-2 h-4 w-4" /> Agregar fila
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Producto</TableHead>
                <TableHead className="min-w-[280px]">Descripcion</TableHead>
                <TableHead className="min-w-[180px]">Unidad</TableHead>
                <TableHead className="min-w-[120px]">Cantidad</TableHead>
                <TableHead className="min-w-[120px]">Peso</TableHead>
                <TableHead className="w-[80px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className="align-top"><ProductCell index={index} /></TableCell>
                  <TableCell className="align-top"><InputCell name={`detalles.${index}.descripcion`} placeholder="Descripcion SUNAT" /></TableCell>
                  <TableCell className="align-top"><UnidadCell index={index} options={unidadOptions} /></TableCell>
                  <TableCell className="align-top"><NumberCell name={`detalles.${index}.cantidad`} min="0.0001" step="0.0001" /></TableCell>
                  <TableCell className="align-top"><NumberCell name={`detalles.${index}.peso`} min="0" step="0.001" /></TableCell>
                  <TableCell className="text-right align-top">
                    <Button aria-label="Eliminar producto" disabled={fields.length === 1} type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {fields.length === 0 ? <p className="text-sm text-muted-foreground">Agrega al menos un producto para la guia.</p> : null}
        {form.formState.errors.detalles?.root?.message ? <p className="text-sm font-medium text-destructive">{form.formState.errors.detalles.root.message}</p> : null}
      </CardContent>
    </Card>
  )
}

function ProductCell({ index }: { index: number }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  const [query, setQuery] = useState("")
  const [selectedProducto, setSelectedProducto] = useState<ProductoOption | null>(null)
  const productos = useQuery({
    queryKey: ["guia-productos", query],
    queryFn: () => guiaRemisionService.searchProductos(query),
    enabled: query.trim().length >= 2,
  })
  const rows = productos.data ?? []
  const options = useMemo(() => {
    const merged = selectedProducto && !rows.some((producto) => producto.id === selectedProducto.id)
      ? [selectedProducto, ...rows]
      : rows

    return merged.map((producto) => ({ value: producto.id, label: producto.nombre, description: producto.codigo_interno ?? undefined }))
  }, [rows, selectedProducto])

  function handleChange(value: string | number | null) {
    form.setValue(`detalles.${index}.producto_id`, value ? Number(value) : null, { shouldValidate: true, shouldDirty: true })

    if (!value) {
      setSelectedProducto(null)
      return
    }

    const selected = rows.find((producto: ProductoOption) => String(producto.id) === String(value)) ?? selectedProducto
    if (selected) {
      setSelectedProducto(selected)
      form.setValue(`detalles.${index}.descripcion`, selected.nombre, { shouldValidate: true, shouldDirty: true })
      if (!form.getValues(`detalles.${index}.unidad_medida`)) {
        form.setValue(`detalles.${index}.unidad_medida`, "NIU", { shouldValidate: true, shouldDirty: true })
      }
    }
  }

  return (
    <FormField control={form.control} name={`detalles.${index}.producto_id`} render={({ field, fieldState }) => (
      <FormItem>
        <FormControl>
          <AppAsyncCombobox value={field.value} onChange={handleChange} options={options} onSearch={setQuery} loading={productos.isFetching} placeholder="Manual / producto" searchPlaceholder="Buscar producto..." emptyMessage="No hay productos" error={!!fieldState.error} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function UnidadCell({ index, options }: { index: number; options: { value: string | number; label: string }[] }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return <FormField control={form.control} name={`detalles.${index}.unidad_medida`} render={({ field, fieldState }) => <FormItem><FormControl><AppCombobox value={field.value} onChange={(value) => field.onChange(value ?? "")} options={options} placeholder="Unidad" searchPlaceholder="Buscar unidad..." emptyMessage="Sin unidades" error={!!fieldState.error} allowClear={false} /></FormControl><FormMessage /></FormItem>} />
}

function InputCell({ name, placeholder }: { name: `detalles.${number}.descripcion`; placeholder: string }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return <FormField control={form.control} name={name} render={({ field, fieldState }) => <FormItem><FormControl><Input {...field} value={field.value ?? ""} placeholder={placeholder} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} /></FormControl><FormMessage /></FormItem>} />
}

function NumberCell({ name, min, step }: { name: `detalles.${number}.cantidad` | `detalles.${number}.peso`; min: string; step: string }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return <FormField control={form.control} name={name} render={({ field, fieldState }) => <FormItem><FormControl><Input type="number" min={min} step={step} value={field.value ?? ""} onChange={(event) => field.onChange(event.target.value)} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} /></FormControl><FormMessage /></FormItem>} />
}
