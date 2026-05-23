import { RefreshCcw } from "lucide-react"
import { useNotasElectronicas } from "@/modules/comprobantes/hooks/useNotasElectronicas"
import { ComprobanteEstadoSunatBadge } from "@/modules/comprobantes/components/ComprobanteEstadoSunatBadge"
import { ComprobanteDocumentActions } from "@/modules/comprobantes/components/ComprobanteDocumentActions"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { formatCurrency, formatDateTime } from "@/modules/caja/components/cajaFormatters"

type Props = { tipo: "NOTA_CREDITO" | "NOTA_DEBITO"; title: string }
export function NotasPage({ tipo, title }: Props) {
  const { data, isLoading, refetch } = useNotasElectronicas(tipo)
  const notas = data?.data ?? []
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="text-sm text-muted-foreground">Consulta notas electronicas, documentos asociados y estado SUNAT.</p></div><Button variant="outline" onClick={() => refetch()}><RefreshCcw className="mr-2 h-4 w-4" />Actualizar</Button></div><Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{isLoading ? <Skeleton className="h-48 w-full" /> : notas.length === 0 ? <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">No hay notas registradas.</div> : <Table><TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Numero</TableHead><TableHead>Motivo</TableHead><TableHead>Total</TableHead><TableHead>SUNAT</TableHead><TableHead>Documentos</TableHead></TableRow></TableHeader><TableBody>{notas.map((nota) => <TableRow key={nota.id}><TableCell>{formatDateTime(nota.fecha_emision)}</TableCell><TableCell className="font-medium">{nota.numero_comprobante}</TableCell><TableCell>{nota.motivo_codigo} {nota.motivo_descripcion}</TableCell><TableCell>{formatCurrency(nota.total)}</TableCell><TableCell><ComprobanteEstadoSunatBadge estado={nota.comprobante_electronico?.estado_sunat ?? "PENDIENTE"} /></TableCell><TableCell>{nota.comprobante_electronico ? <ComprobanteDocumentActions comprobante={nota.comprobante_electronico} compact /> : "-"}</TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card></div>
}