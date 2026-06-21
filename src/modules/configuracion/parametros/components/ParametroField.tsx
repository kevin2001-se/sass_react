import type { ControllerRenderProps, FieldError } from "react-hook-form"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/shared/utils/cn"
import type { Parametro, ParametrosFormValues } from "@/modules/configuracion/parametros/types/parametro.types"

type Props = {
  parametro: Parametro
  field: ControllerRenderProps<ParametrosFormValues, `values.${string}`>
  error?: FieldError
  disabled?: boolean
}

export function ParametroField({ parametro, field, error, disabled }: Props) {
  const inputClassName = cn(error && "input-invalid border-destructive focus-visible:ring-destructive")

  return (
    <div className="rounded-md border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-sm">{parametro.clave}</p>
            <Badge variant="outline">{parametro.tipo}</Badge>
            {parametro.estado ? <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">Activo</Badge> : <Badge variant="secondary">Inactivo</Badge>}
          </div>
          {parametro.descripcion ? <p className="text-sm text-muted-foreground">{parametro.descripcion}</p> : null}
        </div>

        <div className="w-full sm:w-[320px]">
          {parametro.tipo === "boolean" ? (
            <div className="flex h-10 items-center justify-end rounded-md border px-3">
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
                disabled={disabled || !parametro.estado}
                aria-label={`Cambiar ${parametro.clave}`}
                aria-invalid={!!error}
              />
            </div>
          ) : parametro.tipo === "json" ? (
            <Textarea
              value={String(field.value ?? "")}
              onChange={field.onChange}
              disabled={disabled || !parametro.estado}
              aria-invalid={!!error}
              className={cn("min-h-28 font-mono text-xs", inputClassName)}
            />
          ) : (
            <Input
              type={parametro.tipo === "integer" || parametro.tipo === "decimal" ? "number" : "text"}
              step={parametro.tipo === "decimal" ? "0.01" : parametro.tipo === "integer" ? "1" : undefined}
              value={String(field.value ?? "")}
              onChange={field.onChange}
              disabled={disabled || !parametro.estado}
              aria-invalid={!!error}
              className={inputClassName}
            />
          )}
          {error?.message ? <p className="mt-1 text-sm text-destructive">{error.message}</p> : null}
        </div>
      </div>
    </div>
  )
}