import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { NotaDebitoForm } from "@/modules/comprobantes/notas-debito/components/NotaDebitoForm"
import { useCrearNotaDebito } from "@/modules/comprobantes/notas-debito/hooks/useCrearNotaDebito"
import type { NotaDebitoFormValues } from "@/modules/comprobantes/notas-debito/schemas/notaDebito.schema"
import { Button } from "@/shared/components/ui/button"
import { getLaravelValidationErrors, type LaravelValidationErrors } from "@/shared/services/api"

export function NotaDebitoCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mutation = useCrearNotaDebito()
  const [serverErrors, setServerErrors] = useState<LaravelValidationErrors>({})
  const initialComprobanteId = useMemo(() => {
    const value = Number(searchParams.get("comprobante_id"))
    return Number.isFinite(value) && value > 0 ? value : null
  }, [searchParams])

  async function handleSubmit(values: NotaDebitoFormValues) {
    setServerErrors({})
    try {
      const nota = await mutation.mutateAsync(values)
      navigate(`/comprobantes/notas-debito/${nota.id}`)
    } catch (error) {
      setServerErrors(getLaravelValidationErrors(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nueva nota de debito</h1>
          <p className="text-sm text-muted-foreground">Registra conceptos adicionales sobre boletas o facturas aceptadas por SUNAT.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/comprobantes/notas-debito")}>Volver</Button>
      </div>
      <NotaDebitoForm
        initialComprobanteId={initialComprobanteId}
        lockComprobante={Boolean(initialComprobanteId)}
        isSubmitting={mutation.isPending}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/comprobantes/notas-debito")}
      />
    </div>
  )
}