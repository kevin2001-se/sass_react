import { useMutation, useQuery } from "@tanstack/react-query"

import { authService } from "@/shared/services/auth.service"
import type { LoginPayload } from "@/shared/types/auth.types"

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
  })
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.me(),
    enabled,
    retry: false,
  })
}
