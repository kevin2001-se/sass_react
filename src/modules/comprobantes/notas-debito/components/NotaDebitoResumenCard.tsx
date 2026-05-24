import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import type { NotaDebito } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { numberValue } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"

export function NotaDebitoResumenCard({ nota }: { nota: NotaDebito }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Resumen</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Subtotal" value={formatCurrency(numberValue(nota.subtotal))} />
        <Row label="IGV" value={formatCurrency(numberValue(nota.total_igv))} />
        <Separator />
        <Row label="Total" value={formatCurrency(numberValue(nota.total))} strong />
      </CardContent>
    </Card>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span className={strong ? "text-lg font-semibold" : "font-medium"}>{value}</span></div> }