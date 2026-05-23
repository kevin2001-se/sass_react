import { Component, type ErrorInfo, type ReactNode } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

type Props = { children: ReactNode }
type State = { hasError: boolean; message?: string }

export class PosErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("POS error", error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md">
          <CardHeader><CardTitle>El POS necesita recargarse</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Ocurrio un error inesperado. La venta en curso puede estar guardada como borrador local.</p>
            {this.state.message ? <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground">{this.state.message}</p> : null}
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()}>Recargar POS</Button>
              <Button asChild variant="outline"><Link to="/dashboard">Ir dashboard</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}