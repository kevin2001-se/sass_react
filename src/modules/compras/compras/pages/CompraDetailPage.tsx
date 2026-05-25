import { ArrowLeft, XCircle } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { CompraAnularDialog } from "@/modules/compras/compras/components/CompraAnularDialog"
import { CompraDetalleItemsTable } from "@/modules/compras/compras/components/CompraDetalleItemsTable"
import { CompraDetailHeader } from "@/modules/compras/compras/components/CompraDetailHeader"
import { CompraDocumentActions } from "@/modules/compras/compras/components/CompraDocumentActions"
import { CompraMovimientosTable } from "@/modules/compras/compras/components/CompraMovimientosTable"
import { CompraResumenCard } from "@/modules/compras/compras/components/CompraResumenCard"
import { useCompra } from "@/modules/compras/compras/hooks/useCompra"
import { useCompraMutations } from "@/modules/compras/compras/hooks/useCompraMutations"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function CompraDetailPage() {
  const id = Number(useParams().id)
  const query = useCompra(id)
  const mutations = useCompraMutations()
  const [anularOpen, setAnularOpen] = useState(false)
  const compra = query.data

  async function anular(values: { motivo: string }) {
    if (!compra) return
    try {
      await mutations.anular.mutateAsync({ id: compra.id, values })
      toast.success("Compra anulada correctamente. Stock revertido.")
      setAnularOpen(false)
    } catch (error) { toast.error(getLaravelErrorMessage(error, "No se pudo anular la compra.")) }
  }

  if (query.isLoading) return <Skeleton className="h-96 w-full" />
  if (query.isError || !compra) return <Alert variant="destructive"><AlertTitle>No se pudo cargar la compra</AlertTitle><AlertDescription>{getLaravelErrorMessage(query.error)}</AlertDescription></Alert>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><Button asChild variant="outline"><Link to="/compras/historial"><ArrowLeft className="mr-2 h-4 w-4" />Volver</Link></Button><div className="flex gap-2"><CompraDocumentActions compra={compra} />{compra.estado === "REGISTRADA" && <Button variant="destructive" onClick={() => setAnularOpen(true)}><XCircle className="mr-2 h-4 w-4" />Anular</Button>}</div></div>
      <CompraDetailHeader compra={compra} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-6"><Card><CardHeader><CardTitle>Productos</CardTitle></CardHeader><CardContent><CompraDetalleItemsTable detalles={compra.detalles ?? []} /></CardContent></Card><Card><CardHeader><CardTitle>Movimientos de inventario</CardTitle></CardHeader><CardContent>{compra.movimientos_inventario?.length ? <CompraMovimientosTable movimientos={compra.movimientos_inventario} /> : <p className="text-sm text-muted-foreground">Sin movimientos asociados.</p>}</CardContent></Card></div><CompraResumenCard compra={compra} /></div>
      <CompraAnularDialog open={anularOpen} compra={compra} loading={mutations.anular.isPending} onOpenChange={setAnularOpen} onConfirm={anular} />
    </div>
  )
}
