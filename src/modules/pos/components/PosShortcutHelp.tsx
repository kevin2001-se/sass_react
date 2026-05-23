import { Keyboard } from "lucide-react"
import type { ReactNode } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

const shortcuts = [
  ["F2", "Buscar producto", "Enfoca el buscador principal."],
  ["F4", "Cobrar", "Enfoca el panel de pagos."],
  ["F6", "Cliente", "Abre busqueda/seleccion de cliente."],
  ["F8", "Suspendidas", "Abre ventas suspendidas."],
  ["F9", "Suspender", "Guarda temporalmente la venta actual."],
  ["F10", "Registrar venta", "Registra si la venta esta validada."],
  ["Ctrl + Enter", "Registrar venta", "Alternativa rapida para registrar."],
  ["Ctrl + L", "Limpiar carrito", "Pide confirmacion antes de limpiar."],
  ["Ctrl + P", "Imprimir ultimo ticket", "Imprime el ultimo comprobante si existe."],
  ["ESC", "Cerrar/limpiar foco", "Cierra modal activo o limpia foco."],
]

export function PosShortcutHelp({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Keyboard className="h-5 w-5" />Atajos del POS</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader><TableRow><TableHead>Accion</TableHead><TableHead>Shortcut</TableHead><TableHead>Descripcion</TableHead></TableRow></TableHeader>
          <TableBody>{shortcuts.map(([key, action, description]) => <TableRow key={key}><TableCell>{action}</TableCell><TableCell><kbd className="rounded bg-muted px-2 py-1 text-xs font-semibold">{key}</kbd></TableCell><TableCell className="text-muted-foreground">{description}</TableCell></TableRow>)}</TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}