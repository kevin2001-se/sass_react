import { Badge } from "@/shared/components/ui/badge"
import type { Stock } from "@/modules/inventario/types/inventario.types"

type StockStatus = "normal" | "bajo" | "sin_stock" | "vencido" | "por_vencer" | "inactivo"

export function getStockStatus(stock: Stock): StockStatus {
  if (!stock.estado) return "inactivo"

  const cantidad = Number(stock.cantidad_actual)
  if (cantidad <= 0) return "sin_stock"

  if (stock.lote?.fecha_vencimiento) {
    const today = new Date()
    const vencimiento = new Date(`${stock.lote.fecha_vencimiento}T00:00:00`)
    const diffDays = Math.ceil((vencimiento.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "vencido"
    if (diffDays <= 30) return "por_vencer"
  }

  if (stock.cantidad_minima !== null && stock.cantidad_minima !== undefined && cantidad <= Number(stock.cantidad_minima)) {
    return "bajo"
  }

  return "normal"
}

export function StockStatusBadge({ stock }: { stock: Stock }) {
  const status = getStockStatus(stock)
  const map: Record<StockStatus, { label: string; variant: "default" | "secondary" | "outline"; className?: string }> = {
    normal: { label: "Normal", variant: "secondary" },
    bajo: { label: "Bajo stock", variant: "outline" },
    sin_stock: { label: "Sin stock", variant: "default", className: "bg-destructive text-destructive-foreground" },
    vencido: { label: "Vencido", variant: "default", className: "bg-destructive text-destructive-foreground" },
    por_vencer: { label: "Por vencer", variant: "outline" },
    inactivo: { label: "Inactivo", variant: "outline" },
  }

  return <Badge className={map[status].className} variant={map[status].variant}>{map[status].label}</Badge>
}
