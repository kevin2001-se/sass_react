import { NotaDebitoEstadoBadge } from "@/modules/comprobantes/notas-debito/components/NotaDebitoEstadoBadge"
import { NotaDebitoSunatBadge } from "@/modules/comprobantes/notas-debito/components/NotaDebitoSunatBadge"
import type { NotaDebito } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { getNotaDebitoCliente, getNotaDebitoNumero } from "@/modules/comprobantes/notas-debito/types/notaDebito.types"
import { Card, CardContent } from "@/shared/components/ui/card"

export function NotaDebitoDetailHeader({ nota }: { nota: NotaDebito }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Nota de debito</p>
          <h1 className="text-2xl font-semibold tracking-tight">{getNotaDebitoNumero(nota)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{getNotaDebitoCliente(nota)}</p>
        </div>
        <div className="flex flex-wrap gap-2"><NotaDebitoEstadoBadge estado={nota.estado} /><NotaDebitoSunatBadge estado={nota.estado_sunat} /></div>
      </CardContent>
    </Card>
  )
}