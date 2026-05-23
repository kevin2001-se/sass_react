import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { FileText } from "lucide-react"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { GuiaRemisionForm } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionForm"
import { useCrearGuiaRemision } from "@/modules/comprobantes/guias-remision/hooks/useGuiaRemisionMutations"
import type { GuiaRemisionFormValues } from "@/modules/comprobantes/guias-remision/schemas/guiaRemision.schema"
import { guiaRemisionService } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Skeleton } from "@/shared/components/ui/skeleton"
import type { LaravelErrorResponse } from "@/shared/services/api"
import { getLaravelValidationErrors } from "@/shared/services/api"

export function GuiaRemisionCreatePage() {
  const navigate = useNavigate()
  const mutation = useCrearGuiaRemision()

  const motivos = useQuery({ queryKey: ["motivos-traslado"], queryFn: guiaRemisionService.getMotivosTraslado })
  const modalidades = useQuery({ queryKey: ["modalidades-transporte"], queryFn: guiaRemisionService.getModalidadesTransporte })
  const unidades = useQuery({ queryKey: ["unidades-medida-sunat"], queryFn: guiaRemisionService.getUnidadesMedidaSunat })

  const isLoading = motivos.isLoading || modalidades.isLoading || unidades.isLoading
  const isError = motivos.isError || modalidades.isError || unidades.isError
  const serverErrors = useMemo(() => getLaravelValidationErrors(mutation.error), [mutation.error])

  function handleSubmit(values: GuiaRemisionFormValues) {
    mutation.mutate(values, {
      onSuccess: (guia) => navigate(`/comprobantes/guias-remision/${guia.id}`),
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <FileText className="h-4 w-4" />
        <AlertTitle>No se pudo cargar el formulario</AlertTitle>
        <AlertDescription>Revisa que los catalogos SUNAT esten disponibles e intenta nuevamente.</AlertDescription>
      </Alert>
    )
  }

  const axiosError = mutation.error as AxiosError<LaravelErrorResponse> | null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nueva guia de remision</h1>
        <p className="text-sm text-muted-foreground">Registra una guia manual para la tienda activa. El envio SUNAT se habilitara en fases posteriores.</p>
      </div>

      {mutation.isError ? (
        <Alert variant="destructive">
          <FileText className="h-4 w-4" />
          <AlertTitle>No se pudo guardar la guia</AlertTitle>
          <AlertDescription>{axiosError?.response?.data?.message ?? "Corrige los campos marcados e intenta nuevamente."}</AlertDescription>
        </Alert>
      ) : null}

      <GuiaRemisionForm
        motivos={motivos.data ?? []}
        modalidades={modalidades.data ?? []}
        unidades={unidades.data ?? []}
        serverErrors={serverErrors}
        isSubmitting={mutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/comprobantes/guias-remision")}
      />
    </div>
  )
}
