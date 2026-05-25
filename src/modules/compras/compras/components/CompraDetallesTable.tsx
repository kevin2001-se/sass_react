import { Plus, Trash2 } from "lucide-react"
import { type Control, type FieldErrors, useFieldArray, useWatch } from "react-hook-form"

import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { Lote } from "@/modules/inventario/types/inventario.types"
import type { Producto, ProductoPresentacion } from "@/modules/productos/types/producto.types"
import type { CompraFormValues } from "@/modules/compras/compras/types/compra.types"

type CompraDetallesTableProps = {
  control: Control<CompraFormValues>
  register: ReturnType<typeof import("react-hook-form").useForm<CompraFormValues>>["register"]
  setValue: ReturnType<typeof import("react-hook-form").useForm<CompraFormValues>>["setValue"]
  productos: Producto[]
  lotesByProduct: Record<number, Lote[]>
  errors?: FieldErrors<CompraFormValues>
  onCreateProduct?: () => void
}

const emptyRow = { producto_id: null, producto_presentacion_id: null, lote_id: null, codigo_lote: "", fecha_vencimiento: "", cantidad_presentacion: 1, costo_unitario: 0, descuento: 0 }
function precioCompra(presentacion?: ProductoPresentacion | null) { return Number(presentacion?.precio_compra ?? 0) }

export function CompraDetallesTable({ control, register, setValue, productos, lotesByProduct, errors, onCreateProduct }: CompraDetallesTableProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "detalles" })
  const detalles = useWatch({ control, name: "detalles" }) ?? []
  const selectedProduct = (index: number) => productos.find((producto) => producto.id === Number(detalles[index]?.producto_id || 0))

  function productChanged(index: number, value: string | number | null) {
    const productId = value ? Number(value) : null
    const product = productos.find((item) => item.id === productId)
    const presentation = product?.presentacion_principal ?? product?.presentaciones?.[0] ?? null
    setValue(`detalles.${index}.producto_id`, productId, { shouldDirty: true, shouldValidate: true })
    setValue(`detalles.${index}.producto_presentacion_id`, presentation?.id ?? null, { shouldDirty: true, shouldValidate: true })
    setValue(`detalles.${index}.costo_unitario`, precioCompra(presentation), { shouldDirty: true, shouldValidate: true })
    setValue(`detalles.${index}.lote_id`, null, { shouldDirty: true })
    setValue(`detalles.${index}.codigo_lote`, "", { shouldDirty: true })
    setValue(`detalles.${index}.fecha_vencimiento`, "", { shouldDirty: true })
  }

  function presentationChanged(index: number, product: Producto | undefined, value: string | number | null) {
    const presentationId = value ? Number(value) : null
    const presentation = product?.presentaciones?.find((item) => Number(item.id) === presentationId)
    setValue(`detalles.${index}.producto_presentacion_id`, presentationId, { shouldDirty: true, shouldValidate: true })
    setValue(`detalles.${index}.costo_unitario`, precioCompra(presentation), { shouldDirty: true, shouldValidate: true })
  }

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h2 className="text-base font-semibold">Productos</h2><p className="text-sm text-muted-foreground">Selecciona producto, presentacion y lote si corresponde.</p></div><div className="flex shrink-0 flex-col gap-2 sm:flex-row"><Button type="button" variant="outline" onClick={onCreateProduct}><Plus className="mr-2 h-4 w-4" />Nuevo producto</Button><Button type="button" variant="outline" onClick={() => append(emptyRow)}><Plus className="mr-2 h-4 w-4" />Agregar fila</Button></div></div>
      <div className="max-w-full overflow-x-auto rounded-md border">
        <Table className="min-w-[980px] table-fixed"><TableHeader><TableRow><TableHead className="w-[230px]">Producto</TableHead><TableHead className="w-[165px]">Presentacion</TableHead><TableHead className="w-[210px]">Lote</TableHead><TableHead className="w-[140px]">Vencimiento</TableHead><TableHead className="w-[105px]">Cantidad</TableHead><TableHead className="w-[105px]">Costo</TableHead><TableHead className="w-[105px]">Desc.</TableHead><TableHead className="w-[52px]"></TableHead></TableRow></TableHeader>
          <TableBody>{fields.map((field, index) => { const product = selectedProduct(index); const presentaciones = product?.presentaciones ?? []; const manejaLote = Boolean(product?.maneja_lote); const manejaVencimiento = Boolean(product?.maneja_vencimiento); const lotes = product ? lotesByProduct[product.id] ?? [] : []; const rowErrors = errors?.detalles?.[index]; return <TableRow key={field.id}><TableCell className="align-top"><AppCombobox value={detalles[index]?.producto_id ?? null} onChange={(value) => productChanged(index, value)} options={productos.map((producto) => ({ value: producto.id, label: producto.nombre, description: producto.codigo_interno }))} placeholder="Producto" searchPlaceholder="Buscar producto..." emptyMessage="Sin productos" error={!!rowErrors?.producto_id} /></TableCell><TableCell className="align-top"><AppCombobox value={detalles[index]?.producto_presentacion_id ?? null} onChange={(value) => presentationChanged(index, product, value)} options={presentaciones.map((presentacion) => ({ value: presentacion.id ?? 0, label: presentacion.nombre, description: presentacion.precio_compra ? `Compra S/ ${Number(presentacion.precio_compra).toFixed(2)}` : `Factor ${presentacion.factor_conversion}` }))} placeholder="Presentacion" disabled={!product} error={!!rowErrors?.producto_presentacion_id} /></TableCell><TableCell className="align-top">{manejaLote ? <div className="space-y-2"><AppCombobox value={detalles[index]?.lote_id ?? null} onChange={(value) => { setValue(`detalles.${index}.lote_id`, value ? Number(value) : null, { shouldDirty: true, shouldValidate: true }); if (value) setValue(`detalles.${index}.codigo_lote`, "", { shouldDirty: true }) }} options={lotes.map((lote) => ({ value: lote.id, label: lote.codigo_lote, description: lote.fecha_vencimiento ?? undefined }))} placeholder="Lote existente" emptyMessage="Sin lotes" disabled={!product} />{!detalles[index]?.lote_id && <Input placeholder="Nuevo lote" {...register(`detalles.${index}.codigo_lote`)} aria-invalid={!!rowErrors?.codigo_lote} />}</div> : <span className="text-sm text-muted-foreground">No aplica</span>}</TableCell><TableCell className="align-top">{manejaVencimiento ? <Input type="date" {...register(`detalles.${index}.fecha_vencimiento`)} aria-invalid={!!rowErrors?.fecha_vencimiento} /> : <span className="text-sm text-muted-foreground">No aplica</span>}</TableCell><TableCell className="align-top"><Input min="0.01" step="0.01" type="number" {...register(`detalles.${index}.cantidad_presentacion`, { valueAsNumber: true })} aria-invalid={!!rowErrors?.cantidad_presentacion} /></TableCell><TableCell className="align-top"><Input min="0" step="0.01" type="number" {...register(`detalles.${index}.costo_unitario`, { valueAsNumber: true })} aria-invalid={!!rowErrors?.costo_unitario} /></TableCell><TableCell className="align-top"><Input min="0" step="0.01" type="number" {...register(`detalles.${index}.descuento`, { valueAsNumber: true })} aria-invalid={!!rowErrors?.descuento} /></TableCell><TableCell className="align-top"><Button aria-label="Eliminar producto" type="button" size="icon" variant="ghost" onClick={() => remove(index)} disabled={fields.length === 1}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow> })}</TableBody>
        </Table>
      </div>
      {typeof errors?.detalles?.message === "string" && <p className="text-sm text-destructive">{errors.detalles.message}</p>}
    </div>
  )
}
