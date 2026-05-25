import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import type { Compra } from "@/modules/compras/compras/types/compra.types"
function money(value: number | string) { return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(value ?? 0)) }
export function CompraResumenCard({ compra }: { compra: Compra }) {
  return <Card><CardHeader><CardTitle className="text-base">Resumen</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{money(compra.subtotal)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Descuento</span><span>{money(compra.total_descuento)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">IGV</span><span>{money(compra.total_igv)}</span></div><div className="flex justify-between border-t pt-3 text-lg font-semibold"><span>Total</span><span>{money(compra.total)}</span></div></CardContent></Card>
}
