import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { CargaMasivaInventarioDialog } from "@/modules/inventario/components/CargaMasivaInventarioDialog"
import { InventarioFilters } from "@/modules/inventario/components/InventarioFilters"
import { LotesTable } from "@/modules/inventario/components/LotesTable"
import { useCargaMasivaLotes, useCreateLote, useDeleteLote, useUpdateLote } from "@/modules/inventario/hooks/useInventarioMutations"
import { useLotes } from "@/modules/inventario/hooks/useLotes"
import { loteService } from "@/modules/inventario/services/lote.service"
import { loteSchema, type LoteFormValues } from "@/modules/inventario/schemas/inventario.schema"
import type { Lote } from "@/modules/inventario/types/inventario.types"
import { useProductos } from "@/modules/productos/hooks/useProductos"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

export function LotesPage() {
  const [buscar, setBuscar] = useState("")
  const [estado, setEstado] = useState("")
  const [productoId, setProductoId] = useState("")
  const [open, setOpen] = useState(false)
  const [cargaMasivaOpen, setCargaMasivaOpen] = useState(false)
  const [editing, setEditing] = useState<Lote | null>(null)
  const lotesQuery = useLotes({ buscar, estado, producto_id: productoId, per_page: 100 })
  const productosQuery = useProductos({ per_page: 100, estado: "true" })
  const createMutation = useCreateLote()
  const updateMutation = useUpdateLote(editing?.id ?? 0)
  const deleteMutation = useDeleteLote()
  const cargaMasivaMutation = useCargaMasivaLotes()

  const form = useForm<LoteFormValues>({
    resolver: zodResolver(loteSchema) as never,
    defaultValues: { producto_id: 0, codigo_lote: "", fecha_vencimiento: "", estado: true },
  })

  useEffect(() => {
    if (!open) return
    form.reset(editing ? {
      producto_id: editing.producto_id,
      codigo_lote: editing.codigo_lote,
      fecha_vencimiento: editing.fecha_vencimiento ?? "",
      estado: editing.estado,
    } : { producto_id: 0, codigo_lote: "", fecha_vencimiento: "", estado: true })
  }, [open, editing, form])

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(lote: Lote) {
    setEditing(lote)
    setOpen(true)
  }

  async function onSubmit(values: LoteFormValues) {
    try {
      const payload = { ...values, fecha_vencimiento: values.fecha_vencimiento || null }
      if (editing) {
        await updateMutation.mutateAsync(payload)
        toast.success("Lote actualizado correctamente.")
      } else {
        await createMutation.mutateAsync(payload)
        toast.success("Lote creado correctamente.")
      }
      setOpen(false)
      form.reset()
    } catch (error) {
      const errors = getLaravelValidationErrors(error)
      Object.entries(errors).forEach(([field, messages]) => {
        form.setError(field as keyof LoteFormValues, { message: messages[0] })
      })
      toast.error(getLaravelErrorMessage(error, "No se pudo guardar el lote."))
    }
  }

  async function onDelete(lote: Lote) {
    try {
      await deleteMutation.mutateAsync(lote.id)
      toast.success("Lote desactivado correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo desactivar el lote."))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Lotes</h1>
          <p className="text-sm text-muted-foreground">Administra lotes por empresa y producto. El stock del lote se controla por tienda en Inventario.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setCargaMasivaOpen(true)}>Carga masiva</Button>
          <Button onClick={openCreate}>Nuevo lote</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <InventarioFilters
            buscar={buscar}
            estado={estado}
            productoId={productoId}
            productos={productosQuery.data?.data}
            showProducto
            onBuscarChange={setBuscar}
            onEstadoChange={setEstado}
            onProductoChange={setProductoId}
          />
        </CardContent>
      </Card>

      {lotesQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudieron cargar los lotes</AlertTitle>
          <AlertDescription>Revise la API e intente nuevamente.</AlertDescription>
        </Alert>
      )}

      <LotesTable
        isDeleting={deleteMutation.isPending}
        isLoading={lotesQuery.isLoading}
        lotes={lotesQuery.data?.data ?? []}
        onDelete={onDelete}
        onEdit={openEdit}
      />

      <CargaMasivaInventarioDialog
        open={cargaMasivaOpen}
        onOpenChange={setCargaMasivaOpen}
        title="Carga masiva de lotes"
        description="Crea lotes desde Excel o CSV. Esta carga no modifica stock."
        mode="lotes"
        isSubmitting={cargaMasivaMutation.isPending}
        onSubmit={({ archivo }) => cargaMasivaMutation.mutateAsync(archivo)}
        onDownloadTemplate={() => loteService.plantillaCargaMasiva()}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar lote" : "Nuevo lote"}</DialogTitle>
            <DialogDescription>El lote se registra para la empresa. El stock se asociara a la tienda al hacer una entrada de inventario.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
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
                        loading={productosQuery.isLoading}
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button disabled={createMutation.isPending || updateMutation.isPending} type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}





