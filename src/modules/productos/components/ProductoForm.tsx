import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { Link } from "react-router-dom"

import { ProductoPresentacionesForm } from "@/modules/productos/components/ProductoPresentacionesForm"
import { useProductoConfiguracion } from "@/modules/productos/hooks/useProductoConfiguracion"
import { productoSchema, type ProductoFormValues } from "@/modules/productos/schemas/producto.schema"
import type { Producto, ProductoCatalogos } from "@/modules/productos/types/producto.types"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { AppMultiCombobox } from "@/shared/components/forms/AppMultiCombobox"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Textarea } from "@/shared/components/ui/textarea"
import type { LaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

type ProductoFormProps = {
  producto?: Producto
  catalogos: ProductoCatalogos
  isSubmitting?: boolean
  serverErrors?: LaravelValidationErrors
  onSubmit: (values: ProductoFormValues) => void
  onCancel?: () => void
  submitLabel?: string
}

function defaultValues(catalogos?: ProductoCatalogos): ProductoFormValues {
  return {
    codigo_interno: "",
    nombre: "",
    descripcion: "",
    concentracion: "",
    categoria_id: 0,
    marca_id: null,
    laboratorio_id: null,
    principio_activo_id: null,
    principios_activos: [],
    accion_terapeutica_id: null,
    afectacion_igv_id: catalogos?.afectacionesIgv?.find((item) => item.codigo === "10")?.id ?? 0,
    requiere_receta: false,
    maneja_lote: false,
    maneja_vencimiento: false,
    afecto_igv: true,
    estado: true,
    presentaciones: [
      {
        unidad_medida_id: 0,
        nombre: "Unidad",
        codigo_barra: "",
        factor_conversion: 1,
        precio_compra: null,
        precio_venta: 0,
        es_principal: true,
        estado: true,
      },
    ],
  }
}

function productToFormValues(producto: Producto | undefined, catalogos: ProductoCatalogos): ProductoFormValues {
  if (!producto) return defaultValues(catalogos)

  const principios = producto.principios_activos_ids?.length
    ? producto.principios_activos_ids
    : producto.principios_activos?.map((item) => item.id) ?? (producto.principio_activo_id ? [producto.principio_activo_id] : [])

  return {
    codigo_interno: producto.codigo_interno,
    nombre: producto.nombre,
    descripcion: producto.descripcion ?? "",
    concentracion: producto.concentracion ?? "",
    categoria_id: producto.categoria_id,
    marca_id: producto.marca_id ?? null,
    laboratorio_id: producto.laboratorio_id ?? null,
    principio_activo_id: producto.principio_activo_id ?? null,
    principios_activos: principios,
    accion_terapeutica_id: producto.accion_terapeutica_id ?? null,
    afectacion_igv_id: producto.afectacion_igv_id ?? catalogos.afectacionesIgv?.find((item) => item.codigo === "10")?.id ?? 0,
    requiere_receta: Boolean(producto.requiere_receta),
    maneja_lote: Boolean(producto.maneja_lote),
    maneja_vencimiento: Boolean(producto.maneja_vencimiento),
    afecto_igv: Boolean(producto.afecto_igv),
    estado: Boolean(producto.estado),
    presentaciones: producto.presentaciones?.length ? producto.presentaciones.map((presentacion) => ({
      id: presentacion.id,
      unidad_medida_id: presentacion.unidad_medida_id,
      nombre: presentacion.nombre,
      codigo_barra: presentacion.codigo_barra ?? "",
      factor_conversion: Number(presentacion.factor_conversion),
      precio_compra: presentacion.precio_compra === null || presentacion.precio_compra === undefined ? null : Number(presentacion.precio_compra),
      precio_venta: Number(presentacion.precio_venta),
      es_principal: Boolean(presentacion.es_principal),
      estado: Boolean(presentacion.estado),
    })) : defaultValues(catalogos).presentaciones,
  }
}

export function ProductoForm({ producto, catalogos, isSubmitting, serverErrors, onSubmit, onCancel, submitLabel }: ProductoFormProps) {
  const configuracionQuery = useProductoConfiguracion()
  const autogenerarCodigoInterno = Boolean(configuracionQuery.data?.autogenerar_codigo_interno)
  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema) as never,
    defaultValues: productToFormValues(producto, catalogos),
  })

  const manejaLote = form.watch("maneja_lote")

  useEffect(() => {
    if (manejaLote) {
      form.setValue("maneja_vencimiento", true, { shouldValidate: true })
    }
  }, [form, manejaLote])

  useEffect(() => {
    if (!serverErrors) return
    Object.entries(serverErrors).forEach(([field, messages]) => {
      form.setError(field as keyof ProductoFormValues, { type: "server", message: messages[0] })
    })
  }, [form, serverErrors])

  function handleSubmit(values: ProductoFormValues) {
    const principios = values.principios_activos ?? []
    onSubmit({
      ...values,
      codigo_interno: autogenerarCodigoInterno ? null : values.codigo_interno,
      principio_activo_id: principios[0] ?? null,
      principios_activos: principios,
      maneja_vencimiento: values.maneja_lote ? true : values.maneja_vencimiento,
    })
  }

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="farmaceutico">Farmaceutico</TabsTrigger>
            <TabsTrigger value="presentaciones">Presentaciones</TabsTrigger>
            <TabsTrigger value="configuracion">Configuracion</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Datos generales</CardTitle>
                <CardDescription>Informacion principal del producto.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormFieldText disabled={autogenerarCodigoInterno && !producto} name="codigo_interno" label="Codigo interno" placeholder={autogenerarCodigoInterno && !producto ? "Se generara automaticamente" : "PROD001"} />
                <FormFieldText name="nombre" label="Nombre" placeholder="Paracetamol 500mg" />
                <FormFieldSelect name="categoria_id" label="Categoria" items={catalogos.categorias} required />
                <FormFieldSelect name="marca_id" label="Marca" items={catalogos.marcas} />
                <FormFieldText name="concentracion" label="Concentracion" placeholder="500mg" />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Descripcion</FormLabel>
                        <FormControl>
                          <Textarea aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} placeholder="Descripcion opcional" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farmaceutico">
            <Card>
              <CardHeader>
                <CardTitle>Datos farmaceuticos</CardTitle>
                <CardDescription>Laboratorio, principios activos y reglas sanitarias.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormFieldSelect name="laboratorio_id" label="Laboratorio" items={catalogos.laboratorios} />
                <FormFieldMultiSelect name="principios_activos" label="Principios activos" items={catalogos.principiosActivos} />
                <FormFieldSelect name="accion_terapeutica_id" label="Accion terapeutica" items={catalogos.accionesTerapeuticas} />
                <SwitchField name="requiere_receta" label="Requiere receta" />
                <SwitchField name="maneja_lote" label="Maneja lote" />
                <SwitchField name="maneja_vencimiento" label="Maneja vencimiento" disabled={manejaLote} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presentaciones">
            <Card>
              <CardContent className="pt-6">
                <ProductoPresentacionesForm unidadesMedida={catalogos.unidadesMedida} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracion">
            <Card>
              <CardHeader>
                <CardTitle>Configuracion</CardTitle>
                <CardDescription>Tributacion y estado del producto.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormFieldAfectacion items={catalogos.afectacionesIgv} />
                <SwitchField name="estado" label="Activo" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          ) : (
            <Button asChild type="button" variant="outline"><Link to="/productos">Cancelar</Link></Button>
          )}
          <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Guardando..." : submitLabel ?? "Guardar producto"}</Button>
        </div>
      </form>
    </FormProvider>
  )
}

function FormFieldText({ name, label, placeholder, disabled }: { name: keyof ProductoFormValues; label: string; placeholder?: string; disabled?: boolean }) {
  const form = useFormContextStrict()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl><Input aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} disabled={disabled} placeholder={placeholder} {...field} value={String(field.value ?? "")} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function FormFieldSelect({ name, label, items, required }: { name: keyof ProductoFormValues; label: string; items: { id: number; nombre: string }[]; required?: boolean }) {
  const form = useFormContextStrict()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <AppCombobox value={field.value ? Number(field.value) : null} onChange={(value) => field.onChange(value === null ? (required ? 0 : null) : Number(value))} options={items.map((item) => ({ value: item.id, label: item.nombre }))} placeholder="Seleccionar" searchPlaceholder={`Buscar ${label.toLowerCase()}...`} emptyMessage={`No se encontraron ${label.toLowerCase()}`} error={!!fieldState.error} allowClear={!required} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function FormFieldMultiSelect({ name, label, items }: { name: keyof ProductoFormValues; label: string; items: { id: number; nombre: string }[] }) {
  const form = useFormContextStrict()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <AppMultiCombobox value={(field.value as number[]) ?? []} onChange={(value) => field.onChange(value.map(Number))} options={items.map((item) => ({ value: item.id, label: item.nombre }))} placeholder="Seleccione principios" searchPlaceholder="Buscar principio activo..." emptyMessage="No se encontraron principios activos" error={!!fieldState.error} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function FormFieldAfectacion({ items }: { items: ProductoCatalogos["afectacionesIgv"] }) {
  const form = useFormContextStrict()
  return (
    <FormField control={form.control} name="afectacion_igv_id" render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>Afectacion IGV</FormLabel>
        <FormControl>
          <AppCombobox value={field.value ? Number(field.value) : null} onChange={(value) => field.onChange(value === null ? 0 : Number(value))} options={items.map((item) => ({ value: item.id, label: `${item.abreviatura} - ${item.descripcion}`, description: `Codigo ${item.codigo}` }))} placeholder="Seleccione afectacion" searchPlaceholder="Buscar afectacion..." emptyMessage="No se encontraron afectaciones" error={!!fieldState.error} allowClear={false} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

function SwitchField({ name, label, disabled }: { name: keyof ProductoFormValues; label: string; disabled?: boolean }) {
  const form = useFormContextStrict()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem className={cn("flex flex-row items-center justify-between rounded-md border p-4", fieldState.error && "border-destructive")}>
        <FormLabel className="font-normal">{label}</FormLabel>
        <FormControl><Switch aria-invalid={!!fieldState.error} checked={Boolean(field.value)} disabled={disabled} onCheckedChange={field.onChange} /></FormControl>
      </FormItem>
    )} />
  )
}

function useFormContextStrict() {
  return useFormContext<ProductoFormValues>()
}
