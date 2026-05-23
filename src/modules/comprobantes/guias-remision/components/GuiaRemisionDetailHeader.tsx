import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { GuiaRemisionEstadoBadge } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionEstadoBadge"
import { GuiaRemisionSunatBadge } from "@/modules/comprobantes/guias-remision/components/GuiaRemisionSunatBadge"
import type { GuiaRemision } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { getGuiaNumero } from "@/modules/comprobantes/guias-remision/types/guiaRemision.types"
import { Button } from "@/shared/components/ui/button"

function formatDate(value?: string | null) {
  return value ? value.slice(0, 10) : "-"
}

export function GuiaRemisionDetailHeader({ guia }: { guia: GuiaRemision }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <Button variant="ghost" size="sm" className="-ml-2" onClick={() => navigate("/comprobantes/guias-remision")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{getGuiaNumero(guia)}</h1>
          <p className="text-sm text-muted-foreground">Emision {formatDate(guia.fecha_emision)} · Traslado {formatDate(guia.fecha_traslado)}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <GuiaRemisionEstadoBadge estado={guia.estado} />
        <GuiaRemisionSunatBadge estado={guia.estado_sunat} />
      </div>
    </div>
  )
}
