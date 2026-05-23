import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useProductoConfiguracion, useUpdateProductoConfiguracion } from "@/modules/productos/hooks/useProductoConfiguracion"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Switch } from "@/shared/components/ui/switch"
import { getLaravelErrorMessage } from "@/shared/services/api"

export function ProductoBarcodeAutoToggle() {
  const configuracionQuery = useProductoConfiguracion()
  const updateConfiguracion = useUpdateProductoConfiguracion()
  const [autogenerarBarra, setAutogenerarBarra] = useState(false)
  const [prefijoBarra, setPrefijoBarra] = useState("")
  const [autogenerarInterno, setAutogenerarInterno] = useState(true)
  const [prefijoInterno, setPrefijoInterno] = useState("PROD")

  useEffect(() => {
    if (configuracionQuery.data) {
      setAutogenerarBarra(configuracionQuery.data.autogenerar_codigo_barra)
      setPrefijoBarra(configuracionQuery.data.prefijo_codigo_barra ?? "")
      setAutogenerarInterno(configuracionQuery.data.autogenerar_codigo_interno)
      setPrefijoInterno(configuracionQuery.data.prefijo_codigo_interno ?? "PROD")
    }
  }, [configuracionQuery.data])

  async function handleSave() {
    try {
      await updateConfiguracion.mutateAsync({
        autogenerar_codigo_interno: autogenerarInterno,
        prefijo_codigo_interno: prefijoInterno || "PROD",
        autogenerar_codigo_barra: autogenerarBarra,
        prefijo_codigo_barra: prefijoBarra || null,
      })
      toast.success("Configuracion de codigos actualizada.")
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo guardar la configuracion."))
    }
  }

  if (configuracionQuery.isLoading) return <Skeleton className="h-48 w-full" />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Codigos de producto</CardTitle>
        <CardDescription>Laravel genera los codigos dentro de transacciones para evitar duplicados.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        <div className="grid gap-4 rounded-md border p-4 md:grid-cols-[1fr_180px] md:items-end">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="autogenerar_codigo_interno">Autogenerar codigo interno</Label>
              <p className="text-xs text-muted-foreground">Si esta activo, el campo codigo interno se deshabilita al crear producto.</p>
            </div>
            <Switch checked={autogenerarInterno} id="autogenerar_codigo_interno" onCheckedChange={setAutogenerarInterno} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prefijo_codigo_interno">Prefijo interno</Label>
            <Input id="prefijo_codigo_interno" maxLength={20} placeholder="PROD" value={prefijoInterno} onChange={(event) => setPrefijoInterno(event.target.value.toUpperCase())} />
          </div>
        </div>

        <div className="grid gap-4 rounded-md border p-4 md:grid-cols-[1fr_180px] md:items-end">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="autogenerar_codigo_barra">Autogenerar codigo de barra</Label>
              <p className="text-xs text-muted-foreground">Si esta activo, las presentaciones sin codigo recibiran uno automatico.</p>
            </div>
            <Switch checked={autogenerarBarra} id="autogenerar_codigo_barra" onCheckedChange={setAutogenerarBarra} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prefijo_codigo_barra">Prefijo barra</Label>
            <Input id="prefijo_codigo_barra" maxLength={20} placeholder="BOT" value={prefijoBarra} onChange={(event) => setPrefijoBarra(event.target.value.toUpperCase())} />
          </div>
        </div>

        <div className="xl:col-span-2 flex justify-end">
          <Button disabled={updateConfiguracion.isPending} onClick={handleSave}>{updateConfiguracion.isPending ? "Guardando..." : "Guardar configuracion"}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
