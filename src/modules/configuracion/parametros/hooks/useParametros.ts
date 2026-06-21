import { useQuery } from "@tanstack/react-query"
import { parametroService } from "@/modules/configuracion/parametros/services/parametro.service"
import type { ParametroGrupo } from "@/modules/configuracion/parametros/types/parametro.types"

export function useParametros() {
  return useQuery({ queryKey: ["configuracion", "parametros"], queryFn: parametroService.list })
}

export function useParametrosGrupo(grupo: ParametroGrupo) {
  return useQuery({ queryKey: ["configuracion", "parametros", grupo], queryFn: () => parametroService.getByGroup(grupo) })
}
export function useParametro<T = unknown>(clave: string, defaultValue: T) {
  const query = useParametros()
  const parametro = Object.values(query.data ?? {})
    .flat()
    .find((item) => item?.clave === clave)

  return {
    ...query,
    value: (parametro?.valor ?? defaultValue) as T,
    parametro,
  }
}