import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"

import {
  catalogoSchema,
  unidadMedidaSchema,
  type CatalogoAnyFormValues,
} from "@/modules/catalogos/schemas/catalogo.schema"
import type { CatalogoConfig, CatalogoItem } from "@/modules/catalogos/types/catalogo.types"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"
import type { LaravelValidationErrors } from "@/shared/services/api"

type CatalogoFormModalProps = {
  config: CatalogoConfig
  open: boolean
  item?: CatalogoItem | null
  loading?: boolean
  serverErrors?: LaravelValidationErrors
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CatalogoAnyFormValues) => void
}

function getDefaultValues(config: CatalogoConfig, item?: CatalogoItem | null): CatalogoAnyFormValues {
  if (config.isUnidadMedida) {
    return {
      codigo: item?.codigo ?? item?.abreviatura ?? "",
      nombre: item?.nombre ?? "",
      simbolo: item?.simbolo ?? item?.abreviatura ?? "",
      descripcion: item?.descripcion ?? "",
      estado: item?.estado ?? true,
    }
  }

  return {
    nombre: item?.nombre ?? "",
    descripcion: item?.descripcion ?? "",
    estado: item?.estado ?? true,
  }
}

export function CatalogoFormModal({
  config,
  open,
  item,
  loading,
  serverErrors,
  onOpenChange,
  onSubmit,
}: CatalogoFormModalProps) {
  const form = useForm<CatalogoAnyFormValues>({
    resolver: zodResolver(config.isUnidadMedida ? unidadMedidaSchema : catalogoSchema) as never,
    defaultValues: getDefaultValues(config, item),
  })

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(config, item))
    }
  }, [config, form, item, open])

  useEffect(() => {
    if (!serverErrors) {
      return
    }

    Object.entries(serverErrors).forEach(([field, messages]) => {
      form.setError(field as keyof CatalogoAnyFormValues, {
        type: "server",
        message: messages[0],
      })
    })
  }, [form, serverErrors])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? `Editar ${config.title}` : `Nuevo registro`}</DialogTitle>
          <DialogDescription>
            Completa los datos del mantenimiento. Los catálogos pertenecen a la empresa activa.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {config.isUnidadMedida && (
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input maxLength={10} placeholder="NIU" {...field} value={String(field.value ?? "")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} value={String(field.value ?? "")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {config.isUnidadMedida && (
              <FormField
                control={form.control}
                name="simbolo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Símbolo</FormLabel>
                    <FormControl>
                      <Input maxLength={20} placeholder="Und." {...field} value={String(field.value ?? "")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción opcional" {...field} value={String(field.value ?? "")} />
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
                  <FormLabel className="font-normal">Activo</FormLabel>
                  <FormControl>
                    <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button disabled={loading} type="submit">
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
