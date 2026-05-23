import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/utils/cn"

export type AppComboboxOption = {
  label: string
  value: string | number
  description?: string
}

type AppComboboxProps = {
  value?: string | number | null
  onChange: (value: string | number | null) => void
  options: AppComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  loading?: boolean
  error?: boolean
  className?: string
  allowClear?: boolean
  onSearch?: (query: string) => void
}

export function AppCombobox({
  value,
  onChange,
  options,
  placeholder = "Seleccionar",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados",
  disabled,
  loading,
  error,
  className,
  allowClear = true,
  onSearch,
}: AppComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [floatingStyle, setFloatingStyle] = useState<CSSProperties>({})
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const [insideDialog, setInsideDialog] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const selected = options.find((option) => String(option.value) === String(value ?? ""))
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return options
    return options.filter((option) => `${option.label} ${option.description ?? ""}`.toLowerCase().includes(term))
  }, [options, query])

  useEffect(() => {
    if (!open || typeof document === "undefined") return

    const dialog = rootRef.current?.closest<HTMLElement>('[role="dialog"]')
    setPortalContainer(dialog ?? document.body)
    setInsideDialog(Boolean(dialog))
  }, [open])

  useLayoutEffect(() => {
    if (!open) return

    function updatePosition() {
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return

      const width = Math.max(rect.width, 220)
      const availableBelow = window.innerHeight - rect.bottom - 16
      const availableAbove = rect.top - 16
      const shouldOpenAbove = availableBelow < 220 && availableAbove > availableBelow
      const maxHeight = Math.max(180, shouldOpenAbove ? availableAbove : availableBelow)

      if (insideDialog && portalContainer && portalContainer !== document.body) {
        const containerRect = portalContainer.getBoundingClientRect()
        const left = Math.min(
          Math.max(rect.left - containerRect.left, 8),
          Math.max(8, containerRect.width - width - 8),
        )

        setFloatingStyle({
          position: "absolute",
          left,
          top: shouldOpenAbove ? undefined : rect.bottom - containerRect.top + 4,
          bottom: shouldOpenAbove ? containerRect.bottom - rect.top + 4 : undefined,
          width,
          maxHeight,
        })
        return
      }

      const left = Math.min(Math.max(rect.left, 8), window.innerWidth - width - 8)
      setFloatingStyle({
        position: "fixed",
        left,
        top: shouldOpenAbove ? undefined : rect.bottom + 4,
        bottom: shouldOpenAbove ? window.innerHeight - rect.top + 4 : undefined,
        width,
        maxHeight,
      })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [insideDialog, open, portalContainer])

  useEffect(() => {
    if (!open) return

    function closeOnOutsideClick(event: PointerEvent) {
      const target = event.target as Node | null
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener("pointerdown", closeOnOutsideClick)
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick)
  }, [open])

  function selectOption(optionValue: string | number | null) {
    onChange(optionValue)
    setOpen(false)
    setQuery("")
  }

  const panel = open ? (
    <div
      ref={panelRef}
      className="z-[9999] rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      style={floatingStyle}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative p-1">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          autoFocus
          className="h-9 pl-8"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => { setQuery(event.target.value); onSearch?.(event.target.value) }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false)
          }}
        />
      </div>
      <div className="overflow-auto p-1" style={{ maxHeight: "min(16rem, calc(100vh - 7rem))" }}>
        {allowClear && value !== null && value !== undefined && value !== "" && (
          <button className="flex w-full items-center rounded-sm px-2 py-2 text-left text-sm hover:bg-accent" type="button" onClick={() => selectOption(null)}>
            Limpiar seleccion
          </button>
        )}
        {filtered.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
        ) : filtered.map((option) => (
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent"
            key={String(option.value)}
            type="button"
            onClick={() => selectOption(option.value)}
          >
            <Check className={cn("h-4 w-4", String(value ?? "") === String(option.value) ? "opacity-100" : "opacity-0")} />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{option.label}</span>
              {option.description && <span className="block truncate text-xs text-muted-foreground">{option.description}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  ) : null

  return (
    <div ref={rootRef} className="relative">
      <Button
        aria-expanded={open}
        aria-invalid={!!error}
        className={cn(
          "h-10 w-full justify-between border-input bg-background px-3 font-normal text-foreground hover:bg-background",
          !selected && "text-muted-foreground",
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        disabled={disabled}
        role="combobox"
        type="button"
        variant="outline"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        {loading ? <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-60" /> : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
      </Button>

      {panel && portalContainer ? createPortal(panel, portalContainer) : panel}
    </div>
  )
}
