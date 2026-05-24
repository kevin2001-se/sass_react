import type { ReactNode } from "react"
import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import type { NotaCredito } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { numberValue } from "@/modules/comprobantes/notas-credito/types/notaCredito.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"

export function NotaCreditoResumenCard({ nota }: { nota: NotaCredito }) {
  return <Card><CardHeader><CardTitle className="text-base">Resumen</CardTitle></CardHeader><CardContent className="space-y-3"><Row label="Subtotal" value={formatCurrency(numberValue(nota.subtotal))} /><Row label="Descuento" value={formatCurrency(numberValue(nota.total_descuento))} /><Row label="IGV" value={formatCurrency(numberValue(nota.total_igv))} /><Separator /><Row label="Total" value={formatCurrency(numberValue(nota.total))} strong /></CardContent></Card>
}
function Row({ label, value, strong }: { label: string; value: ReactNode; strong?: boolean }) { return <div className={strong ? "flex items-center justify-between text-lg font-semibold" : "flex items-center justify-between text-sm"}><span className="text-muted-foreground">{label}</span><span>{value}</span></div> }