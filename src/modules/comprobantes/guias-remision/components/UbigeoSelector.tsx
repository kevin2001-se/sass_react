import { useFormContext, useWatch } from "react-hook-form"

import { useDepartamentos, useDistritos, useProvincias } from "@/modules/comprobantes/guias-remision/hooks/useUbigeo"
import type { GuiaRemisionFormValues, GuiaDesdeVentaFormValues } from "@/modules/comprobantes/guias-remision/schemas/guiaRemision.schema"
import { AppCombobox } from "@/shared/components/forms/AppCombobox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/utils/cn"

type GuiaUbigeoFormValues = GuiaRemisionFormValues | GuiaDesdeVentaFormValues
type Prefix = "punto_partida" | "punto_llegada"

type Props = {
  prefix: Prefix
  title?: string
  disabled?: boolean
}

export function UbigeoSelector({ prefix, title, disabled }: Props) {
  const form = useFormContext<GuiaUbigeoFormValues>()
  const departamentoId = useWatch({ control: form.control, name: `${prefix}_departamento_id` as never }) as number | string | null | undefined
  const provinciaId = useWatch({ control: form.control, name: `${prefix}_provincia_id` as never }) as number | string | null | undefined

  const departamentos = useDepartamentos()
  const provincias = useProvincias(departamentoId)
  const distritos = useDistritos(provinciaId)

  const departamentoOptions = (departamentos.data ?? []).map((item) => ({ value: item.id, label: `${item.codigo} - ${item.nombre}` }))
  const provinciaOptions = (provincias.data ?? []).map((item) => ({ value: item.id, label: `${item.codigo} - ${item.nombre}` }))
  const distritoRows = distritos.data ?? []
  const distritoOptions = distritoRows.map((item) => ({ value: item.id, label: `${item.ubigeo} - ${item.nombre}` }))

  return (
    <div className="space-y-3">
      {title ? <p className="text-sm font-medium text-muted-foreground">{title}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FormField control={form.control} name={`${prefix}_departamento_id` as never} render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Departamento</FormLabel>
            <FormControl>
              <AppCombobox
                value={field.value as string | number | null}
                onChange={(value) => {
                  field.onChange(value)
                  form.setValue(`${prefix}_provincia_id` as never, null as never, { shouldValidate: true, shouldDirty: true })
                  form.setValue(`${prefix}_distrito_id` as never, null as never, { shouldValidate: true, shouldDirty: true })
                  form.setValue(`${prefix}_ubigeo` as never, "" as never, { shouldValidate: true, shouldDirty: true })
                }}
                options={departamentoOptions}
                placeholder="Departamento"
                searchPlaceholder="Buscar departamento..."
                emptyMessage="No hay departamentos"
                loading={departamentos.isFetching}
                disabled={disabled}
                error={!!fieldState.error}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name={`${prefix}_provincia_id` as never} render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Provincia</FormLabel>
            <FormControl>
              <AppCombobox
                value={field.value as string | number | null}
                onChange={(value) => {
                  field.onChange(value)
                  form.setValue(`${prefix}_distrito_id` as never, null as never, { shouldValidate: true, shouldDirty: true })
                  form.setValue(`${prefix}_ubigeo` as never, "" as never, { shouldValidate: true, shouldDirty: true })
                }}
                options={provinciaOptions}
                placeholder="Provincia"
                searchPlaceholder="Buscar provincia..."
                emptyMessage={departamentoId ? "No hay provincias" : "Seleccione departamento"}
                loading={provincias.isFetching}
                disabled={disabled || !departamentoId}
                error={!!fieldState.error}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name={`${prefix}_distrito_id` as never} render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Distrito</FormLabel>
            <FormControl>
              <AppCombobox
                value={field.value as string | number | null}
                onChange={(value) => {
                  field.onChange(value)
                  const selected = distritoRows.find((item) => String(item.id) === String(value ?? ""))
                  form.setValue(`${prefix}_ubigeo` as never, (selected?.ubigeo ?? "") as never, { shouldValidate: true, shouldDirty: true })
                }}
                options={distritoOptions}
                placeholder="Distrito"
                searchPlaceholder="Buscar distrito..."
                emptyMessage={provinciaId ? "No hay distritos" : "Seleccione provincia"}
                loading={distritos.isFetching}
                disabled={disabled || !provinciaId}
                error={!!fieldState.error}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name={`${prefix}_ubigeo` as never} render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Ubigeo SUNAT</FormLabel>
            <FormControl>
              <Input value={(field.value as string | null) ?? ""} readOnly disabled={disabled} aria-invalid={!!fieldState.error} className={cn("bg-muted/50", fieldState.error && "border-destructive focus-visible:ring-destructive")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    </div>
  )
}
