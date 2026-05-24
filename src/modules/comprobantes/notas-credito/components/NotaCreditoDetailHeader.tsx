import { FileText } from "lucide-react"
import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { NotaCreditoEstadoBadge } from "@/modules/comprobantes/notas-credito/components/NotaCreditoEstadoBadge"
import { NotaCreditoSunatBadge } from "@/modules/comprobantes/notas-credito/components/NotaCreditoSunatBadge"
import type { NotaCredito } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { getNotaCreditoCliente, getNotaCreditoNumero, numberValue } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { Card, CardContent } from "@/shared/components/ui/card"

export function NotaCreditoDetailHeader({ nota }: { nota: NotaCredito }) {
  return (
    <Card><CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"><div className="flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-md bg-indigo-50 text-indigo-700"><FileText className="h-5 w-5" /></div><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-semibold tracking-tight">{getNotaCreditoNumero(nota)}</h1><NotaCreditoEstadoBadge estado={nota.estado} /><NotaCreditoSunatBadge estado={nota.estado_sunat} /></div><p className="mt-1 text-sm text-muted-foreground">{getNotaCreditoCliente(nota)}</p></div></div><div className="text-left md:text-right"><p className="text-xs uppercase text-muted-foreground">Total</p><p className="text-3xl font-bold text-primary">{formatCurrency(numberValue(nota.total))}</p></div></CardContent></Card>
  )
}