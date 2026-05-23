import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { posClienteService } from "@/modules/pos/services/posCliente.service"

export function usePosCustomerSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [query])

  return useQuery({
    queryKey: ["pos", "clientes", debouncedQuery],
    queryFn: () => posClienteService.buscar(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  })
}
