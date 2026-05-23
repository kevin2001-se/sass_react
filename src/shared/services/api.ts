import axios from "axios"
import { useAuthStore } from "@/shared/stores/auth.store"

export type LaravelValidationErrors = Record<string, string[]>

export type LaravelErrorResponse = {
  message?: string
  errors?: LaravelValidationErrors
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
})

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession()
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export function getLaravelErrorMessage(error: unknown, fallback = "Ocurrió un error inesperado.") {
  if (axios.isAxiosError<LaravelErrorResponse>(error)) {
    const data = error.response?.data

    if (data?.message) {
      return data.message
    }
  }

  return fallback
}

export function getLaravelValidationErrors(error: unknown) {
  if (axios.isAxiosError<LaravelErrorResponse>(error)) {
    return error.response?.data?.errors ?? {}
  }

  return {}
}
