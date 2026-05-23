import { useState } from "react"
import { FileArchive, FileCode2, RefreshCcw, Search, Send } from "lucide-react"
import { ComunicacionBajaFormModal } from "@/modules/comprobantes/components/ComunicacionBajaFormModal"
import { ComprobanteEstadoSunatBadge } from "@/modules/comprobantes/components/ComprobanteEstadoSunatBadge"
import { useComunicacionBaja, useComunicacionBajaActions } from "@/modules/comprobantes/hooks/useComunicacionBaja"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { formatDateTime } from "@/modules/caja/components/cajaFormatters"

export function ComunicacionBajaPage() {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useComunicacionBaja()
  const actions = useComunicacionBajaActions()
  const rows = data?.data ?? []
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Comunicacion de baja</h1><p className="text-sm text-muted-foreground">Gestiona bajas SUNAT de documentos aceptados.</p></div><Button onClick={() => setOpen(true)}>Generar baja</Button></div><Card><CardHeader><CardTitle>Comunicaciones</CardTitle></CardHeader><CardContent>{isLoading ? <Skeleton className="h-48 w-full" /> : rows.length === 0 ? <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">No hay comunicaciones de baja.</div> : <Table><TableHeader><TableRow><TableHead>Identificador</TableHead><TableHead>Fecha baja</TableHead><TableHead>Envio</TableHead><TableHead>Estado</TableHead><TableHead>Ticket</TableHead><TableHead>Acciones</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id}><TableCell className="font-medium">{row.identificador}</TableCell><TableCell>{row.fecha_baja}</TableCell><TableCell>{formatDateTime(row.fecha_envio)}</TableCell><TableCell><ComprobanteEstadoSunatBadge estado={row.estado_sunat} /></TableCell><TableCell>{row.ticket ?? "-"}</TableCell><TableCell><div className="flex flex-wrap gap-1"><Button size="sm" variant="ghost" onClick={() => actions.enviar.mutate(row.id)}><Send className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => actions.consultar.mutate(row.id)}><Search className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => actions.reenviar.mutate(row.id)}><RefreshCcw className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => actions.descargarXml(row.id, row.identificador)}><FileCode2 className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => actions.descargarCdr(row.id, row.identificador)}><FileArchive className="h-4 w-4" /></Button></div></TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card><ComunicacionBajaFormModal open={open} loading={actions.generar.isPending} onOpenChange={setOpen} onSubmit={(values) => actions.generar.mutate({ fecha_baja: values.fecha_baja, comprobantes: [{ comprobante_electronico_id: values.comprobante_electronico_id, motivo_baja: values.motivo_baja }] }, { onSuccess: () => setOpen(false) })} /></div>
}