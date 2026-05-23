import { AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"

export function PosCajaAlert() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Debes aperturar caja para vender.</AlertTitle>
      <AlertDescription className="mt-2 flex items-center justify-between gap-3">
        <span>El POS quedarÃ¡ preparado, pero el registro de venta requiere una caja abierta.</span>
        <Button asChild size="sm" variant="outline">
          <Link to="/caja">Ir a caja</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}

