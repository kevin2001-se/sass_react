import { Plus, Search, UserRound } from "lucide-react"
import { useState } from "react"

import { PosCustomerCard } from "@/modules/pos/components/PosCustomerCard"
import { usePosCustomerSearch } from "@/modules/pos/hooks/usePosCustomerSearch"
import type { PosCliente } from "@/modules/pos/types/posCliente.types"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function PosCustomerSearchModal({
  open,
  onOpenChange,
  onSelect,
  onCreate,
  onEdit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (cliente: PosCliente) => void
  onCreate: () => void
  onEdit: (cliente: PosCliente) => void
}) {
  const [query, setQuery] = useState("")
  const searchQuery = usePosCustomerSearch(query)
  const clientes = searchQuery.data ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            Buscar cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              className="pl-9"
              placeholder="Buscar por documento, nombre, telefono o email..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={onCreate}>
              <Plus className="h-4 w-4" />
              Crear nuevo cliente
            </Button>
          </div>

          {query.trim().length < 2 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Escribe al menos 2 caracteres para buscar.
            </div>
          )}

          {searchQuery.isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {searchQuery.isError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              No se pudo buscar clientes.
            </div>
          )}

          {!searchQuery.isLoading && query.trim().length >= 2 && clientes.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              No encontramos clientes con ese criterio.
            </div>
          )}

          <div className="max-h-[52vh] space-y-2 overflow-auto pr-1">
            {clientes.map((cliente) => (
              <PosCustomerCard
                key={cliente.id ?? `${cliente.tipo_documento}-${cliente.numero_documento}`}
                cliente={cliente}
                onEdit={onEdit}
                onSelect={(selected) => {
                  onSelect(selected)
                  onOpenChange(false)
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
