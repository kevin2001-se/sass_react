import type { ReactNode } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"

type PosResumeSuspendedSaleDialogProps = {
  children: ReactNode
  hasCurrentItems: boolean
  onConfirm: () => void
}

export function PosResumeSuspendedSaleDialog({ children, hasCurrentItems, onConfirm }: PosResumeSuspendedSaleDialogProps) {
  if (!hasCurrentItems) {
    return <span onClick={onConfirm}>{children}</span>
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reemplazar venta actual</AlertDialogTitle>
          <AlertDialogDescription>
            Tienes productos en el carrito actual. Si recuperas esta venta suspendida, el carrito y pagos actuales seran reemplazados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Recuperar venta</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}