import { useCallback, useEffect, useState } from "react"

import { AppCombobox, type AppComboboxOption } from "@/shared/components/forms/AppCombobox"

type AppAsyncComboboxProps = {
  value?: string | number | null
  onChange: (value: string | number | null) => void
  options: AppComboboxOption[]
  onSearch: (query: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  loading?: boolean
  error?: boolean
  className?: string
  debounce?: number
}

export function AppAsyncCombobox({ onSearch, debounce = 300, ...props }: AppAsyncComboboxProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const timer = window.setTimeout(() => onSearch(query.trim()), debounce)
    return () => window.clearTimeout(timer)
  }, [debounce, onSearch, query])

  const handleSearch = useCallback((value: string) => setQuery(value), [])

  return <AppCombobox {...props} onSearch={handleSearch} />
}
