import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog"
import { formatDateTime } from "@/modules/caja/components/cajaFormatters"

type DraftInfo = { updated_at: string; items: unknown[] } | null

type Props = {
  open: boolean
  draft: DraftInfo
  onRestore: () => void
  onDiscard: () => void
  onOpenChange: (open: boolean) => void
}

export function PosRestoreDraftDialog({ open, draft, onRestore, onDiscard, onOpenChange }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restaurar venta en curso</AlertDialogTitle>
          <AlertDialogDescription>
            Hay un borrador de venta de {draft ? formatDateTime(draft.updated_at) : "una sesion anterior"} con {draft?.items.length ?? 0} productos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDiscard}>Descartar</AlertDialogCancel>
          <AlertDialogAction onClick={onRestore}>Restaurar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}