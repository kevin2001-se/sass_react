import { Plus, Trash2 } from "lucide-react"

import type { NotaDebitoFormValues } from "@/modules/comprobantes/notas-debito/schemas/notaDebito.schema"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { cn } from "@/shared/utils/cn"

type Props = {
  value: NotaDebitoFormValues["detalles"]
  onChange: (value: NotaDebitoFormValues["detalles"]) => void
  error?: string
}

const emptyRow = { descripcion: "", cantidad: 1, precio_unitario: 0 }

export function NotaDebitoDetalleForm({ value, onChange, error }: Props) {
  const detalles = value.length ? value : []
  const updateRow = (index: number, patch: Partial<(typeof emptyRow)>) => onChange(detalles.map((item, current) => current === index ? { ...item, ...patch } : item))
  const addRow = () => onChange([...detalles, { ...emptyRow }])
  const removeRow = (index: number) => onChange(detalles.filter((_, current) => current !== index))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Conceptos adicionales</CardTitle><Button type="button" variant="outline" size="sm" onClick={addRow}><Plus className="mr-2 h-4 w-4" />Agregar concepto</Button></CardHeader>
      <CardContent className="space-y-3">
        {detalles.length === 0 ? <div className={cn("rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground", error && "border-destructive text-destructive")}>Agrega al menos un concepto adicional.</div> : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead>Descripcion</TableHead><TableHead className="w-32">Cantidad</TableHead><TableHead className="w-40">Precio unitario</TableHead><TableHead className="w-16"></TableHead></TableRow></TableHeader>
              <TableBody>
                {detalles.map((detalle, index) => (
                  <TableRow key={index}>
                    <TableCell><Input value={detalle.descripcion} onChange={(event) => updateRow(index, { descripcion: event.target.value })} placeholder="Ej. Aumento de valor por diferencia de precio" /></TableCell>
                    <TableCell><Input type="number" min="0" step="0.0001" value={detalle.cantidad} onChange={(event) => updateRow(index, { cantidad: Number(event.target.value) })} /></TableCell>
                    <TableCell><Input type="number" min="0" step="0.01" value={detalle.precio_unitario} onChange={(event) => updateRow(index, { precio_unitario: Number(event.target.value) })} /></TableCell>
                    <TableCell className="text-right"><Button type="button" variant="ghost" size="icon" aria-label="Eliminar concepto" onClick={() => removeRow(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  )
}