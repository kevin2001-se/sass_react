import { AxiosError } from "axios"
import { FileText } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { GuiaDesdeVentaForm } from "@/modules/comprobantes/guias-remision/components/GuiaDesdeVentaForm"
import { GuiaVentaPreview } from "@/modules/comprobantes/guias-remision/components/GuiaVentaPreview"
import { VentaSearchForGuia } from "@/modules/comprobantes/guias-remision/components/VentaSearchForGuia"
import { useCrearGuiaDesdeVenta } from "@/modules/comprobantes/guias-remision/hooks/useGuiaRemisionMutations"
import { useGuiaVentaData } from "@/modules/comprobantes/guias-remision/hooks/useGuiaVentaData"
import type { GuiaDesdeVentaFormValues } from "@/modules/comprobantes/guias-remision/schemas/guiaRemision.schema"
import { guiaRemisionService } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"
import type { Venta } from "@/modules/ventas/types/venta.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Skeleton } from "@/shared/components/ui/skeleton"
import type { LaravelErrorResponse } from "@/shared/services/api"
import { getLaravelValidationErrors } from "@/shared/services/api"

export function GuiaDesdeVentaPage() {
  const navigate = useNavigate()
  const [venta, setVenta] = useState<Venta | null>(null)
  const ventaData = useGuiaVentaData(venta?.id ?? null)
  const mutation = useCrearGuiaDesdeVenta()

  const motivos = useQuery({ queryKey: ["motivos-traslado"], queryFn: guiaRemisionService.getMotivosTraslado })
  const modalidades = useQuery({ queryKey: ["modalidades-transporte"], queryFn: guiaRemisionService.getModalidadesTransporte })
  const unidades = useQuery({ queryKey: ["unidades-medida-sunat"], queryFn: guiaRemisionService.getUnidadesMedidaSunat })

  const catalogsLoading = motivos.isLoading || modalidades.isLoading || unidades.isLoading
  const catalogsError = motivos.isError || modalidades.isError || unidades.isError
  const serverErrors = useMemo(() => getLaravelValidationErrors(mutation.error), [mutation.error])
  const axiosError = mutation.error as AxiosError<LaravelErrorResponse> | null

  function handleSubmit(values: GuiaDesdeVentaFormValues) {
    if (!venta) return
    mutation.mutate({ ventaId: venta.id, payload: values }, {
      onSuccess: (guia) => navigate(`/comprobantes/guias-remision/${guia.id}`),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Guia desde venta</h1>
        <p className="text-sm text-muted-foreground">Selecciona una venta, revisa los datos sugeridos y completa el traslado.</p>
      </div>

      <VentaSearchForGuia value={venta?.id ?? null} onChange={setVenta} />

      {ventaData.isError ? (
        <Alert variant="destructive">
          <FileText className="h-4 w-4" />
          <AlertTitle>No se pudieron cargar los datos de la venta</AlertTitle>
          <AlertDescription>Verifica que la venta pertenezca a la tienda activa y no este anulada.</AlertDescription>
        </Alert>
      ) : null}

      <GuiaVentaPreview data={ventaData.data} loading={ventaData.isLoading || ventaData.isFetching} />

      {catalogsError ? (
        <Alert variant="destructive">
          <FileText className="h-4 w-4" />
          <AlertTitle>No se pudo cargar el formulario</AlertTitle>
          <AlertDescription>Revisa los catalogos SUNAT e intenta nuevamente.</AlertDescription>
        </Alert>
      ) : null}

      {mutation.isError ? (
        <Alert variant="destructive">
          <FileText className="h-4 w-4" />
          <AlertTitle>No se pudo guardar la guia</AlertTitle>
          <AlertDescription>{axiosError?.response?.data?.message ?? "Corrige los campos marcados e intenta nuevamente."}</AlertDescription>
        </Alert>
      ) : null}

      {catalogsLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <GuiaDesdeVentaForm
          ventaData={ventaData.data}
          motivos={motivos.data ?? []}
          modalidades={modalidades.data ?? []}
          unidades={unidades.data ?? []}
          serverErrors={serverErrors}
          isSubmitting={mutation.isPending}
          disabled={!venta || !ventaData.data || ventaData.isLoading || ventaData.isError}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/comprobantes/guias-remision")}
        />
      )}
    </div>
  )
}
