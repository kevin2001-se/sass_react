import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useFormContext } from "react-hook-form"

import { useProbarGreConfig } from "@/modules/configuracion/sunat/hooks/useProbarGreConfig"
import type { SunatConfiguracion, SunatConfiguracionFormValues } from "@/modules/configuracion/sunat/types/sunatConfiguracion.types"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { getLaravelErrorMessage } from "@/shared/services/api"
import { cn } from "@/shared/utils/cn"

type Props = {
  configuracion?: SunatConfiguracion | null
  isEdit: boolean
  disabled?: boolean
}

export function SunatGreConfigSection({ configuracion, isEdit, disabled }: Props) {
  const form = useFormContext<SunatConfiguracionFormValues>()
  const probarGre = useProbarGreConfig()
  const greEnabled = form.watch("gre_modo_envio")
  const configured = Boolean(configuracion?.gre_habilitado || configuracion?.tiene_gre_credenciales)

  async function handleProbarGre() {
    try {
      const response = await probarGre.mutateAsync()
      toast.success(response.message || "Configuracion GRE valida.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "Configuracion GRE incompleta."))
    }
  }

  return (
    <Card>
      <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Guias de Remision Electronica</CardTitle>
          <CardDescription>Credenciales API GRE generadas en SUNAT para enviar Guia de Remision Remitente.</CardDescription>
        </div>
        <Badge variant={configured ? "default" : "secondary"}>{configured ? "GRE configurado" : "GRE incompleto"}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField control={form.control} name="gre_modo_envio" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-md border px-4 py-3">
            <div className="space-y-1">
              <FormLabel>Habilitar GRE</FormLabel>
              <p className="text-sm text-muted-foreground">Activa el envio de guias por API GRE. No afecta boletas ni facturas.</p>
            </div>
            <FormControl><Switch checked={field.value} disabled={disabled} onCheckedChange={field.onChange} aria-label="Habilitar GRE" /></FormControl>
          </FormItem>
        )} />

        <div className="grid gap-4 md:grid-cols-2">
          <GreTextField name="gre_client_id" label="GRE Client ID" disabled={disabled || !greEnabled} />
          <GreTextField name="gre_client_secret" label={isEdit ? "Nuevo GRE Client Secret" : "GRE Client Secret"} type="password" disabled={disabled || !greEnabled} />
          <GreTextField name="gre_usuario_sol" label="GRE Usuario SOL" disabled={disabled || !greEnabled} />
          <GreTextField name="gre_clave_sol" label={isEdit ? "Nueva GRE Clave SOL" : "GRE Clave SOL"} type="password" disabled={disabled || !greEnabled} />
          <div className="md:col-span-2"><GreTextField name="gre_scope" label="GRE Scope" disabled={disabled || !greEnabled} /></div>
        </div>

        {isEdit ? <p className="text-sm text-muted-foreground">Deja GRE Client Secret o GRE Clave SOL vacios para mantener los valores actuales.</p> : null}
        {configuracion?.gre_token_url || configuracion?.gre_api_url ? (
          <p className="text-xs text-muted-foreground">Endpoint GRE: {configuracion.gre_api_url} | Token: {configuracion.gre_token_url}</p>
        ) : null}

        <Button type="button" variant="outline" disabled={!configuracion || probarGre.isPending} onClick={handleProbarGre}>
          {probarGre.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Probar configuracion GRE
        </Button>
      </CardContent>
    </Card>
  )
}

type GreFieldName = "gre_client_id" | "gre_client_secret" | "gre_usuario_sol" | "gre_clave_sol" | "gre_scope"

function GreTextField({ name, label, type = "text", disabled }: { name: GreFieldName; label: string; type?: string; disabled?: boolean }) {
  const form = useFormContext<SunatConfiguracionFormValues>()
  return (
    <FormField control={form.control} name={name} render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} value={(field.value as string | null) ?? ""} type={type} disabled={disabled} aria-invalid={!!fieldState.error} className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}