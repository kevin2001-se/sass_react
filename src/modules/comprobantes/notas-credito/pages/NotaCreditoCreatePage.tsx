import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { NotaCreditoForm } from "@/modules/comprobantes/notas-credito/components/NotaCreditoForm"
import { useCrearNotaCredito } from "@/modules/comprobantes/notas-credito/hooks/useCrearNotaCredito"
import type { NotaCreditoFormValues } from "@/modules/comprobantes/notas-credito/schemas/notaCredito.schema"
import { Button } from "@/shared/components/ui/button"
import { getLaravelErrorMessage, getLaravelValidationErrors, type LaravelValidationErrors } from "@/shared/services/api"

export function NotaCreditoCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialComprobanteId = Number(searchParams.get("comprobante_id") || 0) || null
  const mutation = useCrearNotaCredito()
  const [serverErrors, setServerErrors] = useState<LaravelValidationErrors>({})

  async function handleSubmit(values: NotaCreditoFormValues) {
    try {
      setServerErrors({})
      const nota = await mutation.mutateAsync(values)
      toast.success("Nota de credito registrada correctamente.")
      navigate(`/comprobantes/notas-credito/${nota.id}`)
    } catch (error) {
      setServerErrors(getLaravelValidationErrors(error))
      toast.error(getLaravelErrorMessage(error, "No se pudo registrar la nota de credito."))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nueva nota de credito</h1>
          <p className="text-sm text-muted-foreground">Registra una nota total o parcial desde una boleta o factura aceptada.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/comprobantes/notas-credito")}>Volver</Button>
      </div>

      <NotaCreditoForm initialComprobanteId={initialComprobanteId} lockComprobante={Boolean(initialComprobanteId)} isSubmitting={mutation.isPending} serverErrors={serverErrors} onSubmit={handleSubmit} onCancel={() => navigate("/comprobantes/notas-credito")} />
    </div>
  )
}

