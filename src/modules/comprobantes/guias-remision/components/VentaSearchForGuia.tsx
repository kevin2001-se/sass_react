import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { guiaRemisionService } from "@/modules/comprobantes/guias-remision/services/guiaRemision.service"
import type { Venta } from "@/modules/ventas/types/venta.types"
import { getVentaClienteNombre } from "@/modules/ventas/types/venta.types"
import { AppAsyncCombobox } from "@/shared/components/forms/AppAsyncCombobox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"

export function VentaSearchForGuia({ value, onChange }: { value?: number | null; onChange: (venta: Venta | null) => void }) {
  const [query, setQuery] = useState("")
  const [pendingVenta, setPendingVenta] = useState<Venta | null>(null)
  const ventasQuery = useQuery({
    queryKey: ["ventas-para-guia", query],
    queryFn: () => guiaRemisionService.searchVentas(query),
  })

  const ventas = ventasQuery.data ?? []
  const options = ventas.map((venta) => ({
    value: venta.id,
    label: `${venta.numero_comprobante} - ${venta.tipo_comprobante}`,
    description: `${getVentaClienteNombre(venta.cliente)} · S/ ${Number(venta.total ?? 0).toFixed(2)}`,
  }))

  function handleSelect(selected: string | number | null) {
    const venta = ventas.find((item) => String(item.id) === String(selected)) ?? null
    if (value && venta && venta.id !== value) {
      setPendingVenta(venta)
      return
    }
    onChange(venta)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar venta</CardTitle>
        <CardDescription>Busca por numero de comprobante y selecciona la venta origen.</CardDescription>
      </CardHeader>
      <CardContent>
        <AppAsyncCombobox
          value={value ?? null}
          onChange={handleSelect}
          options={options}
          onSearch={setQuery}
          loading={ventasQuery.isFetching}
          placeholder="Seleccione una venta"
          searchPlaceholder="Buscar por numero de comprobante..."
          emptyMessage={ventasQuery.isFetching ? "Buscando ventas..." : "No se encontraron ventas disponibles"}
        />
      </CardContent>
      <AlertDialog open={Boolean(pendingVenta)} onOpenChange={(open) => !open && setPendingVenta(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reemplazar venta seleccionada</AlertDialogTitle>
            <AlertDialogDescription>
              Se reemplazaran los datos sugeridos cargados desde la venta actual. Los datos de traslado que hayas escrito podrian quedar inconsistentes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { onChange(pendingVenta); setPendingVenta(null) }}>Reemplazar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
