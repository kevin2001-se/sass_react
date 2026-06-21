import { useEffect } from "react"
import { setRuntimeSistemaParametros } from "@/shared/utils/parametroRuntime"
import { useParametrosGrupo } from "@/modules/configuracion/parametros/hooks/useParametros"

export function useSyncSistemaParametros() {
  const query = useParametrosGrupo("sistema")

  useEffect(() => {
    if (!query.data) return

    const moneda = query.data.find((item) => item.clave === "moneda_default")?.valor
    const decimales = query.data.find((item) => item.clave === "decimales_montos")?.valor

    setRuntimeSistemaParametros({
      moneda_default: typeof moneda === "string" ? moneda : "PEN",
      decimales_montos: Number(decimales ?? 2),
    })
  }, [query.data])

  return query
}