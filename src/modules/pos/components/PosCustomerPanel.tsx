import { Search, User, UserPlus, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { PosCustomerFormModal } from "@/modules/pos/components/PosCustomerFormModal"
import { usePosRefs } from "@/modules/pos/context/PosRefsContext"
import { PosCustomerSearchModal } from "@/modules/pos/components/PosCustomerSearchModal"
import { PosCustomerValidationAlert } from "@/modules/pos/components/PosCustomerValidationAlert"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import type { PosCliente } from "@/modules/pos/types/posCliente.types"
import { getPosClienteName } from "@/modules/pos/types/posCliente.types"
import type { PosTipoComprobante } from "@/modules/pos/types/pos.types"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Separator } from "@/shared/components/ui/separator"

const comprobantes: PosTipoComprobante[] = ["NOTA_VENTA", "BOLETA", "FACTURA"]

export function PosCustomerPanel() {
  const { customerButtonRef } = usePosRefs()
  const cliente = usePosStore((state) => state.cliente)
  const setCliente = usePosStore((state) => state.setCliente)
  const clearCliente = usePosStore((state) => state.clearCliente)
  const setClienteVarios = usePosStore((state) => state.setClienteVarios)
  const tipoComprobante = usePosStore((state) => state.tipoComprobante)
  const setTipoComprobante = usePosStore((state) => state.setTipoComprobante)
  const [searchOpen, setSearchOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<PosCliente | null>(null)

  function openCreate() {
    setEditingCliente(null)
    setFormOpen(true)
  }

  function openEdit(target: PosCliente) {
    if (!target.id) return
    setEditingCliente(target)
    setFormOpen(true)
  }

  function selectCliente(target: PosCliente) {
    setCliente(target)
    toast.success("Cliente seleccionado.")
  }

  function savedCliente(target: PosCliente) {
    setCliente(target)
    setSearchOpen(false)
  }

  const displayName = cliente ? getPosClienteName(cliente) : "Sin cliente seleccionado"

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4" />
          Cliente y comprobante
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Tipo de comprobante</p>
          <Select value={tipoComprobante} onValueChange={(value) => setTipoComprobante(value as PosTipoComprobante)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {comprobantes.map((tipo) => <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              {cliente?.es_cliente_varios && <Badge variant="secondary">Varios</Badge>}
              {cliente && !cliente.es_cliente_varios && <Badge variant="outline">{cliente.tipo_documento}</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              {cliente ? `${cliente.tipo_documento} ${cliente.numero_documento ?? ""}` : "Para nota de venta puede continuar sin cliente."}
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button ref={customerButtonRef} type="button" variant="outline" onClick={() => setSearchOpen(true)} title="F6 buscar cliente">
            <Search className="h-4 w-4" />
            Buscar cliente
          </Button>
          <Button type="button" variant="outline" onClick={openCreate}>
            <UserPlus className="h-4 w-4" />
            Nuevo cliente
          </Button>
          <Button type="button" variant="secondary" onClick={() => { setClienteVarios(); toast.success("Cliente varios seleccionado.") }}>
            Cliente varios
          </Button>
          <Button type="button" variant="ghost" disabled={!cliente} onClick={clearCliente}>
            <X className="h-4 w-4" />
            Quitar cliente
          </Button>
          {cliente?.id && (
            <Button className="sm:col-span-2" type="button" variant="outline" onClick={() => openEdit(cliente)}>
              Editar cliente seleccionado
            </Button>
          )}
        </div>

        <PosCustomerValidationAlert />
      </CardContent>

      <PosCustomerSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onCreate={openCreate}
        onEdit={openEdit}
        onSelect={selectCliente}
      />
      <PosCustomerFormModal
        open={formOpen}
        cliente={editingCliente}
        onOpenChange={setFormOpen}
        onSaved={savedCliente}
      />
    </Card>
  )
}
