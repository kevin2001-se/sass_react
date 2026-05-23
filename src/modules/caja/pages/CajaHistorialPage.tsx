import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import { useMemo, useState } from "react"

import { ArqueoCajaCard } from "@/modules/caja/components/ArqueoCajaCard"
import { CajaFilters } from "@/modules/caja/components/CajaFilters"
import { CajaStatusBadge, DiferenciaBadge } from "@/modules/caja/components/CajaStatusBadge"
import { formatCurrency, formatDateTime } from "@/modules/caja/components/cajaFormatters"
import { useArqueoCaja } from "@/modules/caja/hooks/useCaja"
import { useCajaHistorial } from "@/modules/caja/hooks/useCajaHistorial"
import type { Caja } from "@/modules/caja/types/caja.types"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

export function CajaHistorialPage() {
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [estado, setEstado] = useState("")
  const [selected, setSelected] = useState<Caja | null>(null)
  const historialQuery = useCajaHistorial({ estado, per_page: 100 })
  const arqueoQuery = useArqueoCaja(selected?.id)
  const cajas = useMemo(() => {
    return (historialQuery.data?.data ?? []).filter((caja) => {
      const fecha = caja.fecha_apertura?.slice(0, 10)
      return (!fechaInicio || fecha >= fechaInicio) && (!fechaFin || fecha <= fechaFin)
    })
  }, [historialQuery.data?.data, fechaInicio, fechaFin])

  const columns: ColumnDef<Caja>[] = [
    { header: "Apertura", cell: ({ row }) => formatDateTime(row.original.fecha_apertura) },
    { header: "Cierre", cell: ({ row }) => formatDateTime(row.original.fecha_cierre) },
    { header: "Monto apertura", cell: ({ row }) => formatCurrency(row.original.monto_apertura) },
    { header: "Sistema", cell: ({ row }) => formatCurrency(row.original.monto_cierre_sistema) },
    { header: "Real", cell: ({ row }) => formatCurrency(row.original.monto_cierre_real) },
    { header: "Diferencia", cell: ({ row }) => <DiferenciaBadge diferencia={row.original.diferencia} /> },
    { header: "Estado", cell: ({ row }) => <CajaStatusBadge estado={row.original.estado} /> },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => (
        <Button size="sm" variant="ghost" onClick={() => setSelected(row.original)}>
          <Eye className="h-4 w-4" />
          Ver arqueo
        </Button>
      ),
    },
  ]
  const table = useReactTable({ data: cajas, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Historial de cajas</h1>
        <p className="text-sm text-muted-foreground">Consulta aperturas, cierres y diferencias por tienda activa.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <CajaFilters
            estado={estado}
            fechaFin={fechaFin}
            fechaInicio={fechaInicio}
            onEstadoChange={setEstado}
            onFechaFinChange={setFechaFin}
            onFechaInicioChange={setFechaInicio}
          />
        </CardContent>
      </Card>

      {historialQuery.isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : cajas.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">No hay cajas para los filtros actuales.</div>
      ) : (
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Arqueo de caja</DialogTitle>
          </DialogHeader>
          {arqueoQuery.data ? <ArqueoCajaCard arqueo={arqueoQuery.data} /> : <Skeleton className="h-64 w-full" />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
