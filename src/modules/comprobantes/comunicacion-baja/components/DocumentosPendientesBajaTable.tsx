import { Checkbox } from "@/shared/components/ui/checkbox"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

import type { DocumentoPendienteBaja } from "../types/comunicacionBaja.types"
import { getDocumentoCliente, getDocumentoNumero } from "../types/comunicacionBaja.types"

export function DocumentosPendientesBajaTable({
  documentos,
  selectedIds,
  onToggle,
  onToggleAll,
  loading,
}: {
  documentos: DocumentoPendienteBaja[]
  selectedIds: number[]
  onToggle: (id: number, checked: boolean) => void
  onToggleAll: (checked: boolean) => void
  loading?: boolean
}) {
  const allSelected = documentos.length > 0 && documentos.every((documento) => selectedIds.includes(documento.id))

  return (
    <Card>
      <CardContent className="max-h-80 overflow-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={allSelected} onCheckedChange={(value) => onToggleAll(Boolean(value))} aria-label="Seleccionar todos" />
              </TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Numero</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Motivo baja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Cargando documentos pendientes...</TableCell></TableRow>
            ) : documentos.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No hay documentos pendientes de baja para la fecha seleccionada.</TableCell></TableRow>
            ) : (
              documentos.map((documento) => (
                <TableRow key={documento.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(documento.id)}
                      onCheckedChange={(value) => onToggle(documento.id, Boolean(value))}
                      aria-label={`Seleccionar ${getDocumentoNumero(documento)}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{documento.tipo_comprobante ?? documento.tipo_documento ?? "-"}</TableCell>
                  <TableCell>{getDocumentoNumero(documento)}</TableCell>
                  <TableCell>{getDocumentoCliente(documento)}</TableCell>
                  <TableCell className="max-w-xs truncate">{documento.motivo_baja ?? "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
