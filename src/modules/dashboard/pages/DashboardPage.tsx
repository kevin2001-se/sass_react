import {
  AlertTriangle,
  CalendarClock,
  CreditCard,
  FileWarning,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { CajaAbiertaCard } from "@/modules/dashboard/components/CajaAbiertaCard"
import { DashboardMetricCard } from "@/modules/dashboard/components/DashboardMetricCard"
import { DashboardSkeleton } from "@/modules/dashboard/components/DashboardSkeleton"
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard"
import type { DashboardResumen } from "@/modules/dashboard/types/dashboard.types"
import { formatCurrency } from "@/modules/dashboard/utils/formatters"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
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
import { getLaravelErrorMessage } from "@/shared/services/api"
import { useAuthStore } from "@/shared/stores/auth.store"

function isEmptyDashboard(data?: DashboardResumen) {
  if (!data) {
    return true
  }

  return (
    data.ventas_dia === 0 &&
    data.compras_dia === 0 &&
    data.utilidad_estimada === 0 &&
    data.productos_bajo_stock === 0 &&
    data.productos_por_vencer === 0 &&
    data.cuentas_por_cobrar_vencidas === 0 &&
    data.cuentas_por_pagar_vencidas === 0 &&
    !data.caja_abierta
  )
}

export function DashboardPage() {
  const tiendaActiva = useAuthStore((state) => state.tiendaActiva)
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary">Dashboard</Badge>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-foreground">
              Resumen operativo
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Indicadores principales de {tiendaActiva?.nombre ?? "la tienda activa"}.
            </p>
          </div>
        </div>

        <Button disabled={isFetching} variant="outline" onClick={() => refetch()}>
          {isFetching ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No se pudo cargar el dashboard</AlertTitle>
          <AlertDescription>
            {getLaravelErrorMessage(error, "Verifica tu sesión, permisos o conexión con la API.")}
          </AlertDescription>
        </Alert>
      )}

      {!isError && data && isEmptyDashboard(data) && (
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertTitle>Sin actividad registrada</AlertTitle>
          <AlertDescription>
            Aún no hay ventas, compras, alertas o caja abierta para esta tienda.
          </AlertDescription>
        </Alert>
      )}

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardMetricCard
              badge="Hoy"
              description="Total vendido en la tienda activa"
              icon={ShoppingCart}
              title="Ventas del día"
              value={formatCurrency(data.ventas_dia)}
            />
            <DashboardMetricCard
              badge="Hoy"
              description="Total comprado en la tienda activa"
              icon={Package}
              title="Compras del día"
              value={formatCurrency(data.compras_dia)}
            />
            <DashboardMetricCard
              badge="Estimado"
              description="Ventas menos compras del día"
              icon={TrendingUp}
              title="Utilidad estimada"
              tone={data.utilidad_estimada >= 0 ? "success" : "warning"}
              value={formatCurrency(data.utilidad_estimada)}
            />
            <DashboardMetricCard
              badge={data.caja_abierta ? "Abierta" : "Pendiente"}
              description="Estado de caja para el turno"
              icon={CreditCard}
              title="Caja abierta"
              tone={data.caja_abierta ? "success" : "warning"}
              value={data.caja_abierta ? `#${data.caja_abierta.id}` : "No"}
            />
            <DashboardMetricCard
              badge="Inventario"
              description="Productos por debajo del mínimo"
              icon={AlertTriangle}
              title="Bajo stock"
              tone={data.productos_bajo_stock > 0 ? "warning" : "default"}
              value={data.productos_bajo_stock}
            />
            <DashboardMetricCard
              badge="Lotes"
              description="Productos próximos a vencer"
              icon={CalendarClock}
              title="Por vencer"
              tone={data.productos_por_vencer > 0 ? "warning" : "default"}
              value={data.productos_por_vencer}
            />
            <DashboardMetricCard
              badge="Clientes"
              description="Cuentas por cobrar vencidas"
              icon={FileWarning}
              title="CxC vencidas"
              tone={data.cuentas_por_cobrar_vencidas > 0 ? "warning" : "default"}
              value={data.cuentas_por_cobrar_vencidas}
            />
            <DashboardMetricCard
              badge="Proveedores"
              description="Cuentas por pagar vencidas"
              icon={FileWarning}
              title="CxP vencidas"
              tone={data.cuentas_por_pagar_vencidas > 0 ? "warning" : "default"}
              value={data.cuentas_por_pagar_vencidas}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <CajaAbiertaCard caja={data.caja_abierta} />

            <Card>
              <CardHeader>
                <CardTitle>Alertas operativas</CardTitle>
                <CardDescription>
                  Señales rápidas para inventario, cartera y proveedores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <AlertRow
                    count={data.productos_bajo_stock}
                    label="Productos con bajo stock"
                    value="Inventario"
                  />
                  <Separator />
                  <AlertRow
                    count={data.productos_por_vencer}
                    label="Productos próximos a vencer"
                    value="FEFO"
                  />
                  <Separator />
                  <AlertRow
                    count={data.cuentas_por_cobrar_vencidas}
                    label="Cuentas por cobrar vencidas"
                    value="Clientes"
                  />
                  <Separator />
                  <AlertRow
                    count={data.cuentas_por_pagar_vencidas}
                    label="Cuentas por pagar vencidas"
                    value="Proveedores"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function AlertRow({
  count,
  label,
  value,
}: {
  count: number
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
        <AlertTriangle className={count > 0 ? "h-4 w-4 text-amber-600" : "h-4 w-4 text-muted-foreground"} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </div>
      <Badge variant={count > 0 ? "secondary" : "outline"}>{count}</Badge>
    </div>
  )
}
