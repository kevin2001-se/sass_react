import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { getLaravelErrorMessage, getLaravelValidationErrors } from "@/shared/services/api"
import { EmpresaForm } from "@/modules/configuracion/empresa/components/EmpresaForm"
import { useEmpresaConfiguracion, useUpdateEmpresa } from "@/modules/configuracion/empresa/hooks/useEmpresa"
import type { EmpresaFormValues } from "@/modules/configuracion/empresa/types/empresa.types"

export function EmpresaPage() {
  const query = useEmpresaConfiguracion()
  const update = useUpdateEmpresa()

  async function handleSubmit(values: EmpresaFormValues) {
    try {
      await update.mutateAsync(values)
      toast.success("Empresa actualizada correctamente.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo actualizar la empresa."))
    }
  }

  if (query.isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-96 w-full" /></div>
  if (query.isError) return <Alert variant="destructive"><AlertTitle>No se pudo cargar empresa</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert>

  return <div className="space-y-6"><div><h1 className="text-2xl font-semibold tracking-tight">Empresa</h1><p className="text-sm text-muted-foreground">Datos fiscales y comerciales de la empresa activa.</p></div><EmpresaForm empresa={query.data} isSubmitting={update.isPending} serverErrors={getLaravelValidationErrors(update.error)} onSubmit={handleSubmit} /></div>
}