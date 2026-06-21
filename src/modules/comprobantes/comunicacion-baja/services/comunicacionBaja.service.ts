import { api } from "@/shared/services/api"

import type {
  ApiSuccess,
  ComunicacionBaja,
  ComunicacionBajaFilters,
  DocumentosPendientesBajaFilters,
  DocumentoPendienteBaja,
  GenerarComunicacionBajaPayload,
  PaginatedResponse,
  PaginationMeta,
} from "../types/comunicacionBaja.types"

type ClassicLaravelPaginator<T> = PaginationMeta & { data: T[] }
type ResourceCollection<T> = { data: T[]; meta?: Partial<PaginationMeta> }

function cleanParams(filters: Record<string, unknown> = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "TODOS"),
  )
}

function unwrapData<T>(payload: T | ApiSuccess<T>): T {
  if (payload && typeof payload === "object" && "success" in payload && "data" in payload) {
    return (payload as ApiSuccess<T>).data
  }

  if (payload && typeof payload === "object" && "data" in payload && !Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: T }).data
  }

  return payload as T
}

function unwrapPaginated<T>(payload: ResourceCollection<T> | ClassicLaravelPaginator<T> | ApiSuccess<ResourceCollection<T> | ClassicLaravelPaginator<T>>) {
  if (payload && typeof payload === "object" && "success" in payload && "data" in payload) {
    return (payload as ApiSuccess<ResourceCollection<T> | ClassicLaravelPaginator<T>>).data
  }

  return payload as ResourceCollection<T> | ClassicLaravelPaginator<T>
}

function normalizePaginated<T>(payload: ResourceCollection<T> | ClassicLaravelPaginator<T> | ApiSuccess<ResourceCollection<T> | ClassicLaravelPaginator<T>>): PaginatedResponse<T> {
  const dataPayload = unwrapPaginated(payload)
  const rows = Array.isArray((dataPayload as ResourceCollection<T>).data) ? (dataPayload as ResourceCollection<T>).data : []
  const metaSource = (dataPayload as ResourceCollection<T>).meta ?? dataPayload as ClassicLaravelPaginator<T>

  return {
    data: rows,
    meta: {
      current_page: Number(metaSource.current_page ?? 1),
      last_page: Number(metaSource.last_page ?? 1),
      per_page: Number(metaSource.per_page ?? rows.length ?? 15),
      total: Number(metaSource.total ?? rows.length),
    },
  }
}

function normalizeCollection<T>(payload: ResourceCollection<T> | T[] | ApiSuccess<ResourceCollection<T> | T[]>): T[] {
  const dataPayload = payload && typeof payload === "object" && "success" in payload && "data" in payload
    ? (payload as ApiSuccess<ResourceCollection<T> | T[]>).data
    : payload

  if (Array.isArray(dataPayload)) return dataPayload
  if (dataPayload && typeof dataPayload === "object" && Array.isArray((dataPayload as ResourceCollection<T>).data)) {
    return (dataPayload as ResourceCollection<T>).data
  }
  return []
}

export const comunicacionBajaService = {
  async getComunicaciones(filters: ComunicacionBajaFilters = {}) {
    const response = await api.get("/comunicaciones-baja", { params: cleanParams(filters) })
    return normalizePaginated<ComunicacionBaja>(response.data)
  },

  async getComunicacion(id: number | string) {
    const response = await api.get(`/comunicaciones-baja/${id}`)
    return unwrapData<ComunicacionBaja>(response.data)
  },

  async getDocumentosPendientes(filters: DocumentosPendientesBajaFilters = {}) {
    const response = await api.get("/comunicaciones-baja/documentos-pendientes", { params: cleanParams(filters) })
    return normalizeCollection<DocumentoPendienteBaja>(response.data)
  },

  async generar(payload: GenerarComunicacionBajaPayload) {
    const response = await api.post("/comunicaciones-baja/generar", payload)
    return unwrapData<ComunicacionBaja>(response.data)
  },

  async enviarSunat(id: number | string) {
    const response = await api.post(`/comunicaciones-baja/${id}/enviar-sunat`)
    return unwrapData<ComunicacionBaja>(response.data)
  },

  async reenviarSunat(id: number | string) {
    const response = await api.post(`/comunicaciones-baja/${id}/reenviar-sunat`)
    return unwrapData<ComunicacionBaja>(response.data)
  },

  async consultarTicket(id: number | string) {
    const response = await api.post(`/comunicaciones-baja/${id}/consultar-ticket`)
    return unwrapData<ComunicacionBaja>(response.data)
  },

  async generarPdfA4(id: number | string) {
    const response = await api.post(`/comunicaciones-baja/${id}/generar-pdf-a4`)
    return unwrapData<ComunicacionBaja>(response.data)
  },

  async descargarPdfA4(id: number | string) {
    const response = await api.get(`/comunicaciones-baja/${id}/pdf-a4`, { responseType: "blob" })
    return response.data as Blob
  },

  async descargarXml(id: number | string) {
    const response = await api.get(`/comunicaciones-baja/${id}/xml`, { responseType: "blob" })
    return response.data as Blob
  },

  async descargarCdr(id: number | string) {
    const response = await api.get(`/comunicaciones-baja/${id}/cdr`, { responseType: "blob" })
    return response.data as Blob
  },
}
