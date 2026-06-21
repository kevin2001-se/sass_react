import { useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { useAuthStore } from "@/shared/stores/auth.store"
import { ParametrosForm } from "@/modules/configuracion/parametros/components/ParametrosForm"
import { ParametrosTabs } from "@/modules/configuracion/parametros/components/ParametrosTabs"
import { useActualizarParametros } from "@/modules/configuracion/parametros/hooks/useActualizarParametros"
import { useParametros } from "@/modules/configuracion/parametros/hooks/useParametros"
import type { ParametroGrupo } from "@/modules/configuracion/parametros/types/parametro.types"

export function ParametrosPage() {
  const [grupoActivo, setGrupoActivo] = useState<ParametroGrupo>("ventas")
  const query = useParametros()
  const update = useActualizarParametros()
  const canEdit = useAuthStore((state) => state.hasPermission("parametros.editar"))

  async function handleSubmit(parametros: Array<{ clave: string; valor: unknown }>) {
    try {
      await update.mutateAsync({ parametros })
      toast.success("Parametros actualizados correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudieron actualizar los parametros."))
    }
  }

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No se pudieron cargar parametros</AlertTitle>
        <AlertDescription>{getLaravelErrorMessage(query.error, "Intenta nuevamente en unos segundos.")}</AlertDescription>
      </Alert>
    )
  }

  const parametros = query.data ?? {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Parametros</h1>
        <p className="text-sm text-muted-foreground">Administra valores globales por empresa sin integrarlos aun a los modulos operativos.</p>
      </div>

      <ParametrosTabs
        value={grupoActivo}
        parametros={parametros}
        onValueChange={setGrupoActivo}
        renderGroup={(grupo, label) => (
          <ParametrosForm
            key={grupo}
            grupoLabel={label}
            parametros={parametros[grupo] ?? []}
            isSubmitting={update.isPending}
            canEdit={canEdit}
            serverErrors={getLaravelValidationErrors(update.error)}
            onSubmit={handleSubmit}
          />
        )}
      />
    </div>
  )
}