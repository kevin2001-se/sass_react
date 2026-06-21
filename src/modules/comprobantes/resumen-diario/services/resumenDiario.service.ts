import { api } from "@/shared/services/api"

import type {
  ApiSuccess,
  GenerarResumenDiarioPayload,
  PaginatedResponse,
  PaginationMeta,
  ResumenDiario,
  ResumenDiarioDetalle,
  ResumenDiarioFilters,
} from "../types/resumenDiario.types"

type ClassicLaravelPaginator<T> = PaginationMeta & { data: T[] }

type ResourceCollection<T> = {
  data: T[]
  meta?: Partial<PaginationMeta>
}

function cleanParams(filters: ResumenDiarioFilters) {
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

export const resumenDiarioService = {
  async getResumenes(filters: ResumenDiarioFilters = {}) {
    const response = await api.get("/resumenes-diarios", { params: cleanParams(filters) })
    return normalizePaginated<ResumenDiario>(response.data)
  },

  async getResumen(id: number | string) {
    const response = await api.get(`/resumenes-diarios/${id}`)
    return unwrapData<ResumenDiario>(response.data)
  },


  async getDocumentosDisponibles(fechaResumen: string) {
    const response = await api.get("/resumenes-diarios/documentos-disponibles", {
      params: { fecha_resumen: fechaResumen },
    })
    return unwrapData<ResumenDiarioDetalle[]>(response.data)
  },
  async generar(payload: GenerarResumenDiarioPayload) {
    const response = await api.post("/resumenes-diarios/generar", payload)
    return unwrapData<ResumenDiario>(response.data)
  },

  async enviarSunat(id: number | string) {
    const response = await api.post(`/resumenes-diarios/${id}/enviar-sunat`)
    return unwrapData<ResumenDiario>(response.data)
  },

  async reenviarSunat(id: number | string) {
    const response = await api.post(`/resumenes-diarios/${id}/reenviar-sunat`)
    return unwrapData<ResumenDiario>(response.data)
  },

  async consultarTicket(id: number | string) {
    const response = await api.post(`/resumenes-diarios/${id}/consultar-ticket`)
    return unwrapData<ResumenDiario>(response.data)
  },

  async generarPdfA4(id: number | string) {
    const response = await api.post(`/resumenes-diarios/${id}/generar-pdf-a4`)
    return unwrapData<ResumenDiario>(response.data)
  },

  async descargarPdfA4(id: number | string) {
    const response = await api.get(`/resumenes-diarios/${id}/pdf-a4`, { responseType: "blob" })
    return response.data as Blob
  },

  async descargarXml(id: number | string) {
    const response = await api.get(`/resumenes-diarios/${id}/xml`, { responseType: "blob" })
    return response.data as Blob
  },

  async descargarCdr(id: number | string) {
    const response = await api.get(`/resumenes-diarios/${id}/cdr`, { responseType: "blob" })
    return response.data as Blob
  },
}