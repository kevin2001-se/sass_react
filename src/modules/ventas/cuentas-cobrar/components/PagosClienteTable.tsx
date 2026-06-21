import { Ban } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { PagoCliente } from "../types/cuentaCobrar.types"
import { clienteNombre, toNumber } from "../types/cuentaCobrar.types"
const money = (v?: number | string | null) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(toNumber(v))
export function PagosClienteTable({ pagos, onAnular }: { pagos: PagoCliente[]; onAnular?: (pago: PagoCliente) => void }) {
  return <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Cliente</TableHead><TableHead>Venta</TableHead><TableHead>Metodo</TableHead><TableHead className="text-right">Monto</TableHead><TableHead>Referencia</TableHead><TableHead>Estado</TableHead>{onAnular && <TableHead className="text-right">Acciones</TableHead>}</TableRow></TableHeader><TableBody>{pagos.map((pago) => <TableRow key={pago.id}><TableCell>{pago.fecha_pago ?? "-"}</TableCell><TableCell>{clienteNombre(pago.cliente ?? pago.cuenta_por_cobrar?.cliente)}</TableCell><TableCell>{pago.venta?.numero_comprobante ?? pago.cuenta_por_cobrar?.venta?.numero_comprobante ?? "-"}</TableCell><TableCell>{pago.metodo_pago}</TableCell><TableCell className="text-right font-semibold">{money(pago.monto)}</TableCell><TableCell>{pago.referencia ?? "-"}</TableCell><TableCell>{pago.estado}</TableCell>{onAnular && <TableCell className="text-right"><Button size="icon" variant="ghost" disabled={pago.estado !== "REGISTRADO"} onClick={() => onAnular(pago)} aria-label="Anular pago"><Ban className="h-4 w-4" /></Button></TableCell>}</TableRow>)}</TableBody></Table></div>
}
