import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { useMemo, useRef, useState } from "react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/utils/cn"

export type AppMultiComboboxOption = {
  label: string
  value: string | number
  description?: string
}

type AppMultiComboboxProps = {
  value?: Array<string | number>
  onChange: (value: Array<string | number>) => void
  options: AppMultiComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  error?: boolean
  className?: string
}

export function AppMultiCombobox({
  value = [],
  onChange,
  options,
  placeholder = "Seleccionar",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados",
  disabled,
  error,
  className,
}: AppMultiComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement | null>(null)
  const selectedValues = value.map(String)
  const selectedOptions = options.filter((option) => selectedValues.includes(String(option.value)))
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return options
    return options.filter((option) => `${option.label} ${option.description ?? ""}`.toLowerCase().includes(term))
  }, [options, query])

  function toggleOption(optionValue: string | number) {
    const exists = selectedValues.includes(String(optionValue))
    onChange(exists ? value.filter((item) => String(item) !== String(optionValue)) : [...value, optionValue])
  }

  function removeOption(optionValue: string | number) {
    onChange(value.filter((item) => String(item) !== String(optionValue)))
  }

  return (
    <div ref={rootRef} className="relative">
      <Button
        aria-expanded={open}
        aria-invalid={!!error}
        className={cn(
          "min-h-10 h-auto w-full justify-between border-input bg-background px-3 py-2 font-normal text-foreground hover:bg-background",
          selectedOptions.length === 0 && "text-muted-foreground",
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        disabled={disabled}
        role="combobox"
        type="button"
        variant="outline"
        onBlur={(event) => {
          if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
        }}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex min-w-0 flex-1 flex-wrap gap-1 text-left">
          {selectedOptions.length ? selectedOptions.map((option) => (
            <Badge className="max-w-full gap-1" key={String(option.value)} variant="secondary">
              <span className="truncate">{option.label}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation()
                  removeOption(option.value)
                }}
              >
                <X className="h-3 w-3" />
              </span>
            </Badge>
          )) : placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-[9999] mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <div className="relative p-1">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input autoFocus className="h-9 pl-8" placeholder={searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="max-h-64 overflow-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
            ) : filtered.map((option) => {
              const checked = selectedValues.includes(String(option.value))
              return (
                <button className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent" key={String(option.value)} type="button" onClick={() => toggleOption(option.value)}>
                  <Check className={cn("h-4 w-4", checked ? "opacity-100" : "opacity-0")} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{option.label}</span>
                    {option.description && <span className="block truncate text-xs text-muted-foreground">{option.description}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
