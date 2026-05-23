import { useState } from "react"
import { FileArchive, FileCode2, RefreshCcw, Search, Send } from "lucide-react"
import { ResumenDiarioFormModal } from "@/modules/comprobantes/components/ResumenDiarioFormModal"
import { ComprobanteEstadoSunatBadge } from "@/modules/comprobantes/components/ComprobanteEstadoSunatBadge"
import { useResumenDiario, useResumenDiarioActions } from "@/modules/comprobantes/hooks/useResumenDiario"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { formatDateTime } from "@/modules/caja/components/cajaFormatters"

export function ResumenDiarioPage() {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useResumenDiario()
  const actions = useResumenDiarioActions()
  const rows = data?.data ?? []
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Resumen diario</h1><p className="text-sm text-muted-foreground">Genera, envia y consulta tickets de resúmenes diarios SUNAT.</p></div><Button onClick={() => setOpen(true)}>Generar resumen</Button></div><Card><CardHeader><CardTitle>Resumenes</CardTitle></CardHeader><CardContent>{isLoading ? <Skeleton className="h-48 w-full" /> : rows.length === 0 ? <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">No hay resumenes diarios.</div> : <Table><TableHeader><TableRow><TableHead>Identificador</TableHead><TableHead>Fecha resumen</TableHead><TableHead>Envio</TableHead><TableHead>Estado</TableHead><TableHead>Ticket</TableHead><TableHead>Acciones</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id}><TableCell className="font-medium">{row.identificador}</TableCell><TableCell>{row.fecha_resumen}</TableCell><TableCell>{formatDateTime(row.fecha_envio)}</TableCell><TableCell><ComprobanteEstadoSunatBadge estado={row.estado_sunat} /></TableCell><TableCell>{row.ticket ?? "-"}</TableCell><TableCell><div className="flex flex-wrap gap-1"><Button size="sm" variant="ghost" onClick={() => actions.enviar.mutate(row.id)}><Send className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => actions.consultar.mutate(row.id)}><Search className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => actions.reenviar.mutate(row.id)}><RefreshCcw className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => actions.descargarXml(row.id, row.identificador)}><FileCode2 className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => actions.descargarCdr(row.id, row.identificador)}><FileArchive className="h-4 w-4" /></Button></div></TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card><ResumenDiarioFormModal open={open} loading={actions.generar.isPending} onOpenChange={setOpen} onSubmit={(values) => actions.generar.mutate(values, { onSuccess: () => setOpen(false) })} /></div>
}