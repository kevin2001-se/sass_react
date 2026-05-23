import { ShieldAlert } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

export function ForbiddenPage() {
  return (
    <div className="grid min-h-[65vh] place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <CardTitle>403</CardTitle>
          <CardDescription>No tienes permiso para acceder a esta sección.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/dashboard">Volver al dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
