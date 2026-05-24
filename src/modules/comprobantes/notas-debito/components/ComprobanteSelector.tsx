import { useCallback, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { formatCurrency } from "@/modules/caja/components/cajaFormatters"
import { getComprobanteClienteNombre, getComprobanteTotal, type ComprobanteElectronico } from "@/modules/comprobantes/types/comprobante.types"
import { notaDebitoService } from "@/modules/comprobantes/notas-debito/services/notaDebito.service"
import { AppAsyncCombobox } from "@/shared/components/forms/AppAsyncCombobox"
import type { AppComboboxOption } from "@/shared/components/forms/AppCombobox"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"

function optionFromComprobante(comprobante: ComprobanteElectronico): AppComboboxOption {
  return {
    value: comprobante.id,
    label: `${comprobante.tipo_comprobante} ${comprobante.numero_comprobante}`,
    description: `${getComprobanteClienteNombre(comprobante)} - ${formatCurrency(getComprobanteTotal(comprobante))}`,
  }
}

type Props = {
  value?: number | null
  error?: boolean
  disabled?: boolean
  onChange: (id: number | null, comprobante?: ComprobanteElectronico | null) => void
}

export function ComprobanteSelector({ value, error, disabled, onChange }: Props) {
  const [query, setQuery] = useState("")
  const { data: optionsData = [], isLoading } = useQuery({
    queryKey: ["notas-debito", "comprobantes-aceptados", query],
    queryFn: () => notaDebitoService.searchComprobantesAceptados(query),
  })

  const selectedQuery = useQuery({
    queryKey: ["sunat-comprobante", value],
    queryFn: () => notaDebitoService.getComprobante(value as number),
    enabled: Boolean(value),
  })

  const allOptions = useMemo(() => {
    const selected = selectedQuery.data ? [selectedQuery.data] : []
    const map = new Map<number, ComprobanteElectronico>()
    for (const item of [...selected, ...optionsData]) map.set(item.id, item)
    return Array.from(map.values())
  }, [optionsData, selectedQuery.data])

  const handleChange = useCallback((newValue: string | number | null) => {
    const id = newValue === null ? null : Number(newValue)
    const selected = id ? allOptions.find((item) => item.id === id) : null
    onChange(id, selected ?? null)
  }, [allOptions, onChange])

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Comprobante aceptado</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <AppAsyncCombobox
          value={value ?? null}
          onChange={handleChange}
          options={allOptions.map(optionFromComprobante)}
          onSearch={setQuery}
          placeholder="Selecciona boleta o factura aceptada"
          searchPlaceholder="Buscar por numero o cliente..."
          emptyMessage="No hay comprobantes aceptados disponibles"
          loading={isLoading || selectedQuery.isLoading}
          error={error}
          disabled={disabled}
        />
        {selectedQuery.isLoading ? <Skeleton className="h-16 w-full" /> : selectedQuery.data ? (
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <p className="font-medium">{selectedQuery.data.tipo_comprobante} {selectedQuery.data.numero_comprobante}</p>
            <p className="text-muted-foreground">{getComprobanteClienteNombre(selectedQuery.data)} - {formatCurrency(getComprobanteTotal(selectedQuery.data))}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}