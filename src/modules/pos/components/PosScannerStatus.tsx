import { ScanBarcode } from "lucide-react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

export function PosScannerStatus({
  enabled,
  lastCode,
  onToggle,
}: {
  enabled: boolean
  lastCode?: string | null
  onToggle: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-muted-foreground">
      <Button aria-label={enabled ? "Pausar scanner" : "Activar scanner"} size="sm" type="button" variant="ghost" onClick={onToggle}>
        <Badge variant={enabled ? "secondary" : "outline"}>
          <ScanBarcode className="mr-1 h-3.5 w-3.5" />
          Scanner {enabled ? "activo" : "pausado"}
        </Badge>
      </Button>
      {lastCode ? <span className="hidden sm:inline">Ultimo codigo: <span className="font-medium">{lastCode}</span></span> : null}
    </div>
  )
}
