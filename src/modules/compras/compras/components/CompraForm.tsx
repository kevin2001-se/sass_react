import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Loader2, PackagePlus, Save } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"

import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { proveedorService } from "@/modules/compras/proveedores/services/proveedor.service"
import { loteService } from "@/modules/inventario/services/lote.service"
import { productoService } from "@/modules/productos/services/producto.service"
import { CompraDetallesTable } from "@/modules/compras/compras/components/CompraDetallesTable"
import { CompraProductoModal } from "@/modules/compras/compras/components/CompraProductoModal"
import { CompraTotalesCard } from "@/modules/compras/compras/components/CompraTotalesCard"
import { compraSchema } from "@/modules/compras/compras/schemas/compra.schema"
import type { CompraFormValues, CompraPayload } from "@/modules/compras/compras/types/compra.types"
import type { Producto } from "@/modules/productos/types/producto.types"

const today = new Date().toISOString().slice(0, 10)
const defaultValues: CompraFormValues = {
  proveedor_id: null,
  tipo_documento: "FACTURA",
  serie: "F001",
  correlativo: "",
  fecha_emision: today,
  fecha_vencimiento: "",
  tipo_pago: "CONTADO",
  moneda: "PEN",
  observacion: "",
  detalles: [{ producto_id: null, producto_presentacion_id: null, lote_id: null, codigo_lote: "", fecha_vencimiento: "", cantidad_presentacion: 1, costo_unitario: 0, descuento: 0 }],
}

type CompraFormProps = {
  loading?: boolean
  serverErrors?: Record<string, string[]>
  onSubmit: (values: CompraPayload) => void
}

function fieldError(errors: Record<string, string[]> | undefined, key: string) {
  return errors?.[key]?.[0]
}

function duplicateKey(values: CompraFormValues, productos: Producto[]) {
  const seen = new Map<string, number>()

  for (const [index, item] of values.detalles.entries()) {
    const productId = Number(item.producto_id || 0)
    const presentationId = Number(item.producto_presentacion_id || 0)
    if (!productId || !presentationId) continue

    const product = productos.find((producto) => producto.id === productId)
    const lotePart = product?.maneja_lote
      ? (item.lote_id ? `lote:${item.lote_id}` : `codigo:${(item.codigo_lote ?? "").trim().toUpperCase()}`)
      : "sin-lote"
    const key = `${productId}:${presentationId}:${lotePart}`

    if (seen.has(key)) {
      return { current: index, previous: seen.get(key)! }
    }

    seen.set(key, index)
  }

  return null
}

export function CompraForm({ loading, serverErrors, onSubmit }: CompraFormProps) {
  const [productModalOpen, setProductModalOpen] = useState(false)
  const form = useForm<CompraFormValues>({ resolver: zodResolver(compraSchema) as any, defaultValues })
  const detalles = useWatch({ control: form.control, name: "detalles" }) ?? []

  const proveedoresQuery = useQuery({ queryKey: ["compras", "proveedores", "select"], queryFn: () => proveedorService.list({ estado: "1", per_page: 100 }) })
  const productosQuery = useQuery({ queryKey: ["productos", "compras", "select"], queryFn: () => productoService.getProductos({ estado: "1", per_page: 100 }) })

  const productos = productosQuery.data?.data ?? []
  const selectedProductIds = useMemo(() => Array.from(new Set(detalles.map((item) => Number(item.producto_id || 0)).filter(Boolean))), [detalles])
  const lotesQuery = useQuery({
    queryKey: ["lotes", "compras", selectedProductIds],
    enabled: selectedProductIds.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(selectedProductIds.map(async (id) => [id, (await loteService.getLotes({ producto_id: String(id), estado: "1", per_page: 100 })).data] as const))
      return Object.fromEntries(entries)
    },
  })

  function submit(values: CompraFormValues) {
    const duplicated = duplicateKey(values, productos)
    if (duplicated) {
      form.setError("detalles", { type: "manual", message: `Producto duplicado en filas ${duplicated.previous + 1} y ${duplicated.current + 1}. Ajusta la cantidad en una sola fila.` })
      return
    }

    onSubmit({
      ...values,
      proveedor_id: Number(values.proveedor_id),
      serie: values.serie.trim().toUpperCase(),
      correlativo: values.correlativo.trim(),
      fecha_vencimiento: values.fecha_vencimiento || null,
      observacion: values.observacion?.trim() || null,
      detalles: values.detalles.map((item) => ({
        ...item,
        producto_id: Number(item.producto_id),
        producto_presentacion_id: Number(item.producto_presentacion_id),
        lote_id: item.lote_id ? Number(item.lote_id) : null,
        codigo_lote: item.codigo_lote?.trim() || null,
        fecha_vencimiento: item.fecha_vencimiento || null,
        descuento: Number(item.descuento || 0),
      })),
    })
  }

  return (
    <form className="min-w-0 space-y-6" onSubmit={form.handleSubmit(submit as any)}>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(260px,300px)]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle>Datos de compra</CardTitle><Button type="button" variant="outline" onClick={() => setProductModalOpen(true)}><PackagePlus className="mr-2 h-4 w-4" />Nuevo producto</Button></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2 lg:col-span-2">
                <Label>Proveedor</Label>
                <AppCombobox
                  value={form.watch("proveedor_id")}
                  onChange={(value) => form.setValue("proveedor_id", value ? Number(value) : null, { shouldDirty: true, shouldValidate: true })}
                  options={(proveedoresQuery.data?.data ?? []).map((proveedor) => ({ value: proveedor.id, label: proveedor.razon_social, description: proveedor.numero_documento }))}
                  placeholder="Seleccione proveedor"
                  searchPlaceholder="Buscar proveedor..."
                  loading={proveedoresQuery.isLoading}
                  error={!!form.formState.errors.proveedor_id || !!fieldError(serverErrors, "proveedor_id")}
                />
                {(form.formState.errors.proveedor_id?.message || fieldError(serverErrors, "proveedor_id")) && <p className="text-sm text-destructive">{form.formState.errors.proveedor_id?.message ?? fieldError(serverErrors, "proveedor_id")}</p>}
              </div>

              <div className="space-y-2">
                <Label>Tipo documento</Label>
                <Select value={form.watch("tipo_documento")} onValueChange={(value) => form.setValue("tipo_documento", value as CompraFormValues["tipo_documento"], { shouldDirty: true })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FACTURA">Factura</SelectItem>
                    <SelectItem value="BOLETA">Boleta</SelectItem>
                    <SelectItem value="NOTA_COMPRA">Nota compra</SelectItem>
                    <SelectItem value="GUIA_PROVEEDOR">Guia proveedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2"><Label>Serie</Label><Input {...form.register("serie")} aria-invalid={!!form.formState.errors.serie} /></div>
              <div className="space-y-2"><Label>Correlativo</Label><Input {...form.register("correlativo")} aria-invalid={!!form.formState.errors.correlativo} /></div>
              <div className="space-y-2"><Label>Fecha emision</Label><Input type="date" {...form.register("fecha_emision")} aria-invalid={!!form.formState.errors.fecha_emision} /></div>
              <div className="space-y-2"><Label>Fecha vencimiento</Label><Input type="date" {...form.register("fecha_vencimiento")} /></div>

              <div className="space-y-2">
                <Label>Tipo pago</Label>
                <Select value={form.watch("tipo_pago")} onValueChange={(value) => form.setValue("tipo_pago", value as CompraFormValues["tipo_pago"], { shouldDirty: true })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="CONTADO">Contado</SelectItem><SelectItem value="CREDITO">Credito</SelectItem></SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3"><Label>Observacion</Label><Textarea rows={3} {...form.register("observacion")} /></div>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardContent className="min-w-0 pt-6">
              <CompraDetallesTable
                control={form.control}
                register={form.register}
                setValue={form.setValue}
                productos={productos}
                lotesByProduct={lotesQuery.data ?? {}}
                errors={form.formState.errors}
              onCreateProduct={() => setProductModalOpen(true)}
              />
              {productosQuery.isError && <p className="mt-3 text-sm text-destructive">No se pudieron cargar productos.</p>}
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0 space-y-4 xl:sticky xl:top-4 xl:self-start">
          <CompraTotalesCard detalles={detalles} />
          {fieldError(serverErrors, "detalles") && <p className="text-sm text-destructive">{fieldError(serverErrors, "detalles")}</p>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Registrar compra
          </Button>
        </div>
      <CompraProductoModal open={productModalOpen} onOpenChange={setProductModalOpen} onCreated={() => productosQuery.refetch()} />
      </div>
    </form>
  )
}
