export type CatalogoKind =
  | "categorias"
  | "marcas"
  | "laboratorios"
  | "principios-activos"
  | "acciones-terapeuticas"
  | "unidades-medida"

export type CatalogoPermisos = {
  ver: string
  crear: string
  editar: string
  eliminar: string
}

export type CatalogoConfig = {
  kind: CatalogoKind
  title: string
  description: string
  endpoint: string
  isUnidadMedida?: boolean
  permisos: CatalogoPermisos
}

export type CatalogoItem = {
  id: number
  nombre: string
  descripcion?: string | null
  abreviatura?: string | null
  codigo?: string | null
  simbolo?: string | null
  estado: boolean
  created_at?: string
  updated_at?: string
}

export type CatalogoPayload = {
  nombre: string
  descripcion?: string | null
  abreviatura?: string | null
  estado: boolean
}

export type UnidadMedidaFormPayload = {
  codigo: string
  nombre: string
  simbolo: string
  descripcion?: string | null
  estado: boolean
}

export type CatalogoFilters = {
  buscar?: string
  estado?: string
  page?: number
  per_page?: number
}

export type PaginatedCatalogoResponse = {
  data: CatalogoItem[]
  meta?: {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
  }
}

export const catalogosConfig: Record<CatalogoKind, CatalogoConfig> = {
  categorias: {
    kind: "categorias",
    title: "Categorías",
    description: "Clasificación comercial y operativa de productos.",
    endpoint: "/categorias",
    permisos: {
      ver: "categorias.ver",
      crear: "categorias.crear",
      editar: "categorias.editar",
      eliminar: "categorias.eliminar",
    },
  },
  marcas: {
    kind: "marcas",
    title: "Marcas",
    description: "Marcas comerciales asociadas al catálogo de productos.",
    endpoint: "/marcas",
    permisos: {
      ver: "marcas.ver",
      crear: "marcas.crear",
      editar: "marcas.editar",
      eliminar: "marcas.eliminar",
    },
  },
  laboratorios: {
    kind: "laboratorios",
    title: "Laboratorios",
    description: "Laboratorios farmacéuticos de fabricación o distribución.",
    endpoint: "/laboratorios",
    permisos: {
      ver: "laboratorios.ver",
      crear: "laboratorios.crear",
      editar: "laboratorios.editar",
      eliminar: "laboratorios.eliminar",
    },
  },
  "principios-activos": {
    kind: "principios-activos",
    title: "Principios activos",
    description: "Sustancias activas usadas en productos farmacéuticos.",
    endpoint: "/principios-activos",
    permisos: {
      ver: "principios_activos.ver",
      crear: "principios_activos.crear",
      editar: "principios_activos.editar",
      eliminar: "principios_activos.eliminar",
    },
  },
  "acciones-terapeuticas": {
    kind: "acciones-terapeuticas",
    title: "Acciones terapéuticas",
    description: "Clasificación terapéutica para segmentar productos.",
    endpoint: "/acciones-terapeuticas",
    permisos: {
      ver: "acciones_terapeuticas.ver",
      crear: "acciones_terapeuticas.crear",
      editar: "acciones_terapeuticas.editar",
      eliminar: "acciones_terapeuticas.eliminar",
    },
  },
  "unidades-medida": {
    kind: "unidades-medida",
    title: "Unidades de medida",
    description: "Unidades usadas en presentaciones y conversiones.",
    endpoint: "/unidades-medida",
    isUnidadMedida: true,
    permisos: {
      ver: "unidades_medida.ver",
      crear: "unidades_medida.crear",
      editar: "unidades_medida.editar",
      eliminar: "unidades_medida.eliminar",
    },
  },
}
