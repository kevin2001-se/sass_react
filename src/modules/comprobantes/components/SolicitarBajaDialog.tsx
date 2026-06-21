import type { ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/shared/utils/cn"

const schema = z.object({ motivo_baja: z.string().min(5, "Ingresa un motivo de al menos 5 caracteres.").max(500) })
type FormValues = z.infer<typeof schema>

type Props = {
  children?: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (motivo: string) => Promise<void> | void
  loading?: boolean
  isSubmitting?: boolean
  comprobanteNumero?: string
}

export function SolicitarBajaDialog({ children, open, onOpenChange, onConfirm, loading, isSubmitting, comprobanteNumero }: Props) {
  const isLoading = loading ?? isSubmitting ?? false
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { motivo_baja: "" } })
  const submit = form.handleSubmit(async (values) => {
    await onConfirm(values.motivo_baja)
    form.reset()
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dar de baja comprobante</DialogTitle>
          <DialogDescription>
            Esta accion revertira los efectos internos del documento{comprobanteNumero ? ` ${comprobanteNumero}` : ""} y lo dejara disponible para Comunicacion de Baja.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motivo_baja">Motivo de baja</Label>
            <Textarea id="motivo_baja" rows={4} className={cn(form.formState.errors.motivo_baja && "input-invalid")} {...form.register("motivo_baja")} />
            {form.formState.errors.motivo_baja ? <p className="text-sm text-red-600">{form.formState.errors.motivo_baja.message}</p> : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isLoading} onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Confirmar baja</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
