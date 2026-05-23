import { useEffect } from "react"

import { AppLoadingPage } from "@/shared/pages/AppLoadingPage"
import { authService } from "@/shared/services/auth.service"
import { setAuthToken } from "@/shared/services/api"
import { useAuthStore } from "@/shared/stores/auth.store"

export function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const {
    token,
    isBootstrapped,
    isLoading,
    hydrateFromStorage,
    setLoading,
    setSessionFromApi,
    clearSession,
  } = useAuthStore()

  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const storedToken = useAuthStore.getState().token

      if (!storedToken) {
        clearSession()
        return
      }

      try {
        setLoading(true)
        setAuthToken(storedToken)
        const session = await authService.me()

        if (!cancelled) {
          setSessionFromApi({
            ...session,
            token: storedToken,
          })
        }
      } catch {
        if (!cancelled) {
          clearSession()
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [clearSession, setLoading, setSessionFromApi, token])

  if (!isBootstrapped || isLoading) {
    return <AppLoadingPage />
  }

  return children
}
