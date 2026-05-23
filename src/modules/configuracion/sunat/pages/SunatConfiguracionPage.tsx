import { AlertTriangle, CheckCircle2, Settings2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { SunatConfiguracionForm } from "@/modules/configuracion/sunat/components/SunatConfiguracionForm"
import { useSunatConfiguracion } from "@/modules/configuracion/sunat/hooks/useSunatConfiguracion"
import { useCreateSunatConfiguracion, useDeleteSunatConfiguracion, useUpdateSunatConfiguracion } from "@/modules/configuracion/sunat/hooks/useSunatConfiguracionMutations"
import type { SunatConfiguracionFormValues } from "@/modules/configuracion/sunat/types/sunatConfiguracion.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog"
import { getLaravelErrorMessage, getLaravelValidationErrors, type LaravelValidationErrors } from "@/shared/services/api"
import { useAuthStore } from "@/shared/stores/auth.store"

export function SunatConfiguracionPage() {
  const configuracionQuery = useSunatConfiguracion()
  const createMutation = useCreateSunatConfiguracion()
  const updateMutation = useUpdateSunatConfiguracion()
  const deleteMutation = useDeleteSunatConfiguracion()
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const [serverErrors, setServerErrors] = useState<LaravelValidationErrors>({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  const configuracion = configuracionQuery.data ?? null
  const isEdit = Boolean(configuracion)
  const canCreate = hasPermission("sunat.configuracion.crear")
  const canEdit = hasPermission("sunat.configuracion.editar")
  const canDelete = hasPermission("sunat.configuracion.eliminar")
  const canSubmit = isEdit ? canEdit : canCreate
  const isSaving = createMutation.isPending || updateMutation.isPending

  async function handleSubmit(values: SunatConfiguracionFormValues) {
    setServerErrors({})
    try {
      if (configuracion) {
        await updateMutation.mutateAsync({ id: configuracion.id, values })
        toast.success("Configuracion SUNAT actualizada correctamente.")
      } else {
        await createMutation.mutateAsync(values)
        toast.success("Configuracion SUNAT creada correctamente.")
      }
    } catch (error) {
      setServerErrors(getLaravelValidationErrors(error))
      toast.error(getLaravelErrorMessage(error, "No se pudo guardar la configuracion SUNAT."))
    }
  }

  async function handleDelete() {
    if (!configuracion) return
    try {
      await deleteMutation.mutateAsync(configuracion.id)
      setConfirmDelete(false)
      toast.success("Configuracion SUNAT desactivada correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo desactivar la configuracion SUNAT."))
    }
  }

  if (configuracionQuery.isLoading) {
    return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-[520px] w-full" /></div>
  }

  if (configuracionQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No se pudo cargar la configuracion SUNAT</AlertTitle>
        <AlertDescription>{getLaravelErrorMessage(configuracionQuery.error, "Intenta recargar la pagina.")}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configuracion SUNAT</h1>
          <p className="text-sm text-muted-foreground">Gestiona credenciales SOL, certificado digital, ambiente y modo de envio por empresa.</p>
        </div>
        {configuracion ? (
          <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{configuracion.estado ? "Configuracion activa" : "Configuracion inactiva"}</span>
          </div>
        ) : null}
      </div>

      {!configuracion ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" /> Sin configuracion activa</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Registra una configuracion SUNAT para habilitar futuros envios electronicos. Esta fase no emite comprobantes todavia.</CardContent>
        </Card>
      ) : null}

      {!canSubmit ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Permiso requerido</AlertTitle>
          <AlertDescription>No tienes permiso para {isEdit ? "editar" : "crear"} la configuracion SUNAT.</AlertDescription>
        </Alert>
      ) : null}

      <SunatConfiguracionForm
        configuracion={configuracion}
        serverErrors={serverErrors}
        isSubmitting={isSaving || !canSubmit}
        onSubmit={handleSubmit}
        onDelete={() => setConfirmDelete(true)}
        canDelete={Boolean(configuracion && canDelete)}
        isDeleting={deleteMutation.isPending}
      />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desactivar configuracion SUNAT</AlertDialogTitle>
            <AlertDialogDescription>La configuracion dejara de estar activa para la empresa. Podras crear o activar otra configuracion luego.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? "Desactivando..." : "Desactivar"}</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
