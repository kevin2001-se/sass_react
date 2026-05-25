import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog"
import type { Proveedor } from "@/modules/compras/proveedores/types/proveedor.types"

export function ProveedorDeleteDialog({ proveedor, open, loading, onOpenChange, onConfirm }: { proveedor?: Proveedor | null; open: boolean; loading?: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar proveedor</AlertDialogTitle>
          <AlertDialogDescription>
            {proveedor ? `Se desactivará ${proveedor.razon_social}. No se eliminará físicamente y podrá conservar su historial de compras.` : "Se desactivará el proveedor seleccionado."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={onConfirm}>{loading ? "Desactivando..." : "Desactivar"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}