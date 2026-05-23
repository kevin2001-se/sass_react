import { CreditCard, Wallet } from "lucide-react"
import { Link } from "react-router-dom"

import type { CajaAbierta } from "@/modules/dashboard/types/dashboard.types"
import { formatCurrency, formatDateTime } from "@/modules/dashboard/utils/formatters"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"

type CajaAbiertaCardProps = {
  caja: CajaAbierta | null
}

export function CajaAbiertaCard({ caja }: CajaAbiertaCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Caja actual</CardTitle>
            <CardDescription>Estado operativo de la tienda activa.</CardDescription>
          </div>
          <Badge variant={caja ? "secondary" : "outline"}>
            {caja ? "Abierta" : "Sin apertura"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {caja ? (
          <>
            <div className="flex items-center gap-3 rounded-md border bg-background p-4">
              <div className="rounded-md bg-indigo-50 p-2 text-indigo-700">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Caja #{caja.id}</p>
                <p className="text-xs text-muted-foreground">
                  Aperturada: {formatDateTime(caja.fecha_apertura)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border bg-background p-3">
                <p className="text-xs text-muted-foreground">Monto apertura</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(caja.monto_apertura)}
                </p>
              </div>
              <div className="rounded-md border bg-background p-3">
                <p className="text-xs text-muted-foreground">Estado</p>
                <p className="mt-1 text-lg font-semibold">Activa</p>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link to="/caja">Ir a caja</Link>
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-md border border-dashed bg-background p-4">
              <div className="rounded-md bg-muted p-2 text-muted-foreground">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">No hay caja abierta</p>
                <p className="text-xs text-muted-foreground">
                  Apertura una caja para registrar ingresos y egresos del turno.
                </p>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link to="/caja">Aperturar caja</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
