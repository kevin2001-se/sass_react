import type { CatalogoItem } from "@/modules/catalogos/types/catalogo.types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"

type CatalogoDeleteDialogProps = {
  item: CatalogoItem | null
  open: boolean
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function CatalogoDeleteDialog({
  item,
  open,
  loading,
  onOpenChange,
  onConfirm,
}: CatalogoDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar registro</AlertDialogTitle>
          <AlertDialogDescription>
            El registro {item ? `"${item.nombre}"` : ""} no se eliminará físicamente. Se marcará como inactivo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={onConfirm}>
            Desactivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
