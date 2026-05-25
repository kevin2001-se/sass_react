import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
export function AdminEmptyState({ title = "Sin registros", description = "No hay información para mostrar." }: { title?: string; description?: string }) {
  return <Alert><AlertTitle>{title}</AlertTitle><AlertDescription>{description}</AlertDescription></Alert>
}