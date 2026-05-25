import { api } from "@/shared/services/api"
import type { EmpresaConfiguracion, EmpresaFormValues } from "@/modules/configuracion/empresa/types/empresa.types"

function unwrap<T>(response: T | { data: T }): T { return (response as { data?: T }).data ?? response as T }

function toFormData(values: EmpresaFormValues) {
  const form = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (key === "logo") {
      const file = value instanceof FileList ? value.item(0) : null
      if (file) form.append("logo", file)
      return
    }
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  form.append("_method", "PUT")
  return form
}

export const empresaService = {
  async get() {
    const { data } = await api.get<EmpresaConfiguracion | { data: EmpresaConfiguracion }>("/configuracion/empresa")
    return unwrap(data)
  },
  async update(values: EmpresaFormValues) {
    const { data } = await api.post<EmpresaConfiguracion | { data: EmpresaConfiguracion }>("/configuracion/empresa", toFormData(values), { headers: { "Content-Type": "multipart/form-data" } })
    return unwrap(data)
  },
}