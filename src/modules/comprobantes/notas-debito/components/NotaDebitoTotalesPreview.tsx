import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import type { NotaDebitoFormValues } from "@/modules/comprobantes/notas-debito/schemas/notaDebito.schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"

const IGV = 0.18

export function calcularTotalesNd(detalles: NotaDebitoFormValues["detalles"]) {
  const total = detalles.reduce((sum, item) => sum + Number(item.cantidad || 0) * Number(item.precio_unitario || 0), 0)
  const subtotal = total / (1 + IGV)
  const igv = total - subtotal
  return { subtotal, igv, total }
}

export function NotaDebitoTotalesPreview({ values }: { values: NotaDebitoFormValues }) {
  const totals = calcularTotalesNd(values.detalles ?? [])
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Vista previa referencial</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
        <Row label="IGV" value={formatCurrency(totals.igv)} />
        <Separator />
        <Row label="Total adicional" value={formatCurrency(totals.total)} strong />
        <p className="text-xs text-muted-foreground">El backend recalcula y valida los importes finales antes de registrar.</p>
      </CardContent>
    </Card>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span className={strong ? "text-lg font-semibold" : "font-medium"}>{value}</span></div> }