import { api } from "@/shared/services/api"
import type {
  AccionTerapeutica,
  AfectacionIgv,
  Categoria,
  Laboratorio,
  Marca,
  PrincipioActivo,
  ProductoCatalogos,
  UnidadMedida,
} from "@/modules/productos/types/producto.types"

type CollectionResponse<T> = T[] | { data: T[] }

function unwrapCollection<T>(payload: CollectionResponse<T>) {
  return Array.isArray(payload) ? payload : payload.data
}

async function getCatalogo<T>(url: string) {
  const { data } = await api.get<CollectionResponse<T>>(url)
  return unwrapCollection(data)
}

export const productoCatalogosService = {
  async getCatalogos(): Promise<ProductoCatalogos> {
    const [
      categorias,
      marcas,
      laboratorios,
      principiosActivos,
      accionesTerapeuticas,
      unidadesMedida,
      afectacionesIgv,
    ] = await Promise.all([
      getCatalogo<Categoria>("/categorias"),
      getCatalogo<Marca>("/marcas"),
      getCatalogo<Laboratorio>("/laboratorios"),
      getCatalogo<PrincipioActivo>("/principios-activos"),
      getCatalogo<AccionTerapeutica>("/acciones-terapeuticas"),
      getCatalogo<UnidadMedida>("/unidades-medida"),
      getCatalogo<AfectacionIgv>("/afectaciones-igv"),
    ])

    return {
      categorias,
      marcas,
      laboratorios,
      principiosActivos,
      accionesTerapeuticas,
      unidadesMedida,
      afectacionesIgv,
    }
  },
}
