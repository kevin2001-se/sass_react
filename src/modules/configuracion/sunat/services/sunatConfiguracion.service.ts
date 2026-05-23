import axios from "axios"

import { api } from "@/shared/services/api"
import type { SunatConfiguracion, SunatConfiguracionFormValues } from "@/modules/configuracion/sunat/types/sunatConfiguracion.types"

type ResourceResponse<T> = { data: T }

function unwrap<T>(response: T | ResourceResponse<T>): T {
  return response && typeof response === "object" && "data" in response ? (response as ResourceResponse<T>).data : response as T
}

function toFormData(values: SunatConfiguracionFormValues, method?: "PUT") {
  const formData = new FormData()
  if (method) formData.append("_method", method)

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (["clave_sol", "certificado_password", "gre_client_secret", "gre_clave_sol"].includes(key) && String(value).trim() === "") return
    if (key === "certificado") {
      if (value instanceof File) formData.append(key, value)
      return
    }
    formData.append(key, typeof value === "boolean" ? (value ? "1" : "0") : String(value))
  })

  return formData
}

export const sunatConfiguracionService = {
  async getConfiguracion() {
    try {
      const { data } = await api.get<SunatConfiguracion | ResourceResponse<SunatConfiguracion>>("/sunat/configuracion")
      return unwrap(data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null
      throw error
    }
  },

  async createConfiguracion(values: SunatConfiguracionFormValues) {
    const { data } = await api.post<SunatConfiguracion | ResourceResponse<SunatConfiguracion>>(
      "/sunat/configuracion",
      toFormData(values),
      { headers: { "Content-Type": "multipart/form-data" } },
    )
    return unwrap(data)
  },

  async updateConfiguracion(id: number, values: SunatConfiguracionFormValues) {
    const { data } = await api.post<SunatConfiguracion | ResourceResponse<SunatConfiguracion>>(
      `/sunat/configuracion/${id}`,
      toFormData(values, "PUT"),
      { headers: { "Content-Type": "multipart/form-data" } },
    )
    return unwrap(data)
  },

  async probarGre() {
    const { data } = await api.post<{ success: boolean; message: string }>("/sunat/configuracion/probar-gre")
    return data
  },

  async deleteConfiguracion(id: number) {
    const { data } = await api.delete<{ message: string }>(`/sunat/configuracion/${id}`)
    return data
  },
}
