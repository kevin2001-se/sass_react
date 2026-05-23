import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { SessionBootstrap } from "@/app/SessionBootstrap"
import { Toaster } from "@/shared/components/ui/sonner"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap>{children}</SessionBootstrap>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
