import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Save } from "lucide-react"
import { useEffect, useMemo } from "react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import type { LaravelValidationErrors } from "@/shared/services/api"
import { ParametroField } from "@/modules/configuracion/parametros/components/ParametroField"
import { buildParametrosSchema, parametrosToDefaultValues, parametrosToPayload } from "@/modules/configuracion/parametros/schemas/parametro.schema"
import type { Parametro, ParametrosFormValues } from "@/modules/configuracion/parametros/types/parametro.types"

type Props = {
  grupoLabel: string
  parametros: Parametro[]
  isSubmitting?: boolean
  canEdit?: boolean
  serverErrors?: LaravelValidationErrors
  onSubmit: (payload: ReturnType<typeof parametrosToPayload>) => void
}

export function ParametrosForm({ grupoLabel, parametros, isSubmitting, canEdit = true, serverErrors, onSubmit }: Props) {
  const schema = useMemo(() => buildParametrosSchema(parametros), [parametros])
  const defaultValues = useMemo(() => parametrosToDefaultValues(parametros), [parametros])
  const form = useForm<ParametrosFormValues>({ resolver: zodResolver(schema), defaultValues })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  useEffect(() => {
    Object.entries(serverErrors ?? {}).forEach(([field, messages]) => {
      const match = field.match(/^parametros\.\d+\.valor$/)
      if (!match) return
      form.setError("values", { message: messages[0] })
    })
  }, [serverErrors, form])

  function submit(values: ParametrosFormValues) {
    onSubmit(parametrosToPayload(parametros, values))
  }

  if (!parametros.length) {
    return <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No hay parametros en este grupo.</CardContent></Card>
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{grupoLabel}</CardTitle>
          <Button type="submit" disabled={!canEdit || isSubmitting || !form.formState.isDirty}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.formState.errors.values?.message ? <p className="text-sm text-destructive">{String(form.formState.errors.values.message)}</p> : null}
          {parametros.map((parametro) => (
            <Controller
              key={parametro.clave}
              control={form.control}
              name={`values.${parametro.clave}`}
              render={({ field, fieldState }) => (
                <ParametroField parametro={parametro} field={field} error={fieldState.error} disabled={!canEdit || isSubmitting} />
              )}
            />
          ))}
        </CardContent>
      </Card>
    </form>
  )
}