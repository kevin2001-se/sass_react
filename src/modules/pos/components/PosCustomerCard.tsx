import { Mail, Phone, UserRound } from "lucide-react"

import type { PosCliente } from "@/modules/pos/types/posCliente.types"
import { getPosClienteName } from "@/modules/pos/types/posCliente.types"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"

export function PosCustomerCard({ cliente, onSelect, onEdit }: { cliente: PosCliente; onSelect?: (cliente: PosCliente) => void; onEdit?: (cliente: PosCliente) => void }) {
  return (
    <Card className="hover:border-primary/60">
      <CardContent className="flex items-start justify-between gap-3 p-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <UserRound className="h-4 w-4 text-primary" />
            <p className="font-semibold">{getPosClienteName(cliente)}</p>
            <Badge variant="outline">{cliente.tipo_documento}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{cliente.numero_documento || "Sin documento"}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {cliente.telefono && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{cliente.telefono}</span>}
            {cliente.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{cliente.email}</span>}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {onEdit && <Button size="sm" variant="outline" onClick={() => onEdit(cliente)}>Editar</Button>}
          {onSelect && <Button size="sm" onClick={() => onSelect(cliente)}>Seleccionar</Button>}
        </div>
      </CardContent>
    </Card>
  )
}
