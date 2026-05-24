import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { ComprobanteFilters } from "@/modules/comprobantes/components/ComprobanteFilters"
import { ComprobantesTable } from "@/modules/comprobantes/components/ComprobantesTable"
import { useComprobantes } from "@/modules/comprobantes/hooks/useComprobantes"
import type { ComprobanteElectronico, ComprobanteFilters as Filters } from "@/modules/comprobantes/types/comprobante.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

type Props = { title: string; description: string; tipo: string }

export function ComprobantesDocumentPage({ title, description, tipo }: Props) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filters>({ tipo_comprobante: tipo, page: 1, per_page: 15 })
  const { data, isLoading, isError, refetch } = useComprobantes({ ...filters, tipo_comprobante: tipo })
  const meta = data?.meta

  const openNota = (comprobante: ComprobanteElectronico, tipoNota: "NOTA_CREDITO" | "NOTA_DEBITO") => {
    const path = tipoNota === "NOTA_CREDITO" ? "notas-credito" : "notas-debito"
    navigate(`/comprobantes/${path}/nueva?comprobante_id=${comprobante.id}`)
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="text-sm text-muted-foreground">{description}</p></div>
      <ComprobanteFilters fixedTipo={tipo} filters={filters} onChange={setFilters} onReset={() => setFilters({ tipo_comprobante: tipo, page: 1, per_page: 15 })} />
      {isError ? <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>No se pudo cargar</AlertTitle><AlertDescription><Button variant="outline" size="sm" onClick={() => refetch()}>Reintentar</Button></AlertDescription></Alert> : null}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{title}</CardTitle>{meta ? <span className="text-sm text-muted-foreground">{meta.total} registros</span> : null}</CardHeader>
        <CardContent className="space-y-4">
          <ComprobantesTable comprobantes={data?.data ?? []} isLoading={isLoading} onNotaCredito={(c) => openNota(c, "NOTA_CREDITO")} onNotaDebito={(c) => openNota(c, "NOTA_DEBITO")} />
          {meta && meta.last_page > 1 ? <div className="flex justify-end gap-2"><Button variant="outline" size="sm" disabled={meta.current_page <= 1} onClick={() => setFilters((f) => ({ ...f, page: Number(f.page ?? 1) - 1 }))}>Anterior</Button><Button variant="outline" size="sm" disabled={meta.current_page >= meta.last_page} onClick={() => setFilters((f) => ({ ...f, page: Number(f.page ?? 1) + 1 }))}>Siguiente</Button></div> : null}
        </CardContent>
      </Card>
    </div>
  )
}