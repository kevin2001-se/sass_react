import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"

import { notaElectronicaSchema, type NotaElectronicaFormValues } from "@/modules/comprobantes/schemas/notaElectronica.schema"
import type { ComprobanteElectronico } from "@/modules/comprobantes/types/comprobante.types"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"

type Props = {
  open: boolean
  tipo: "NOTA_CREDITO" | "NOTA_DEBITO"
  comprobante?: ComprobanteElectronico | null
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: NotaElectronicaFormValues) => void
}

const motivosCredito = [
  ["01", "ANULACION_OPERACION"], ["06", "DEVOLUCION_TOTAL"], ["07", "DEVOLUCION_ITEM"], ["09", "DISMINUCION_VALOR"], ["10", "OTROS_CONCEPTOS"],
]
const motivosDebito = [["01", "INTERESES_MORA"], ["02", "AUMENTO_VALOR"], ["03", "PENALIDADES"]]

export function NotaElectronicaFormModal({ open, tipo, comprobante, loading, onOpenChange, onSubmit }: Props) {
  const form = useForm<NotaElectronicaFormValues>({
    resolver: zodResolver(notaElectronicaSchema) as never,
    values: {
      comprobante_referencia_id: comprobante?.id ?? 0,
      motivo_codigo: tipo === "NOTA_CREDITO" ? "06" : "02",
      motivo_descripcion: tipo === "NOTA_CREDITO" ? "DEVOLUCION_TOTAL" : "AUMENTO_VALOR",
      afecta_stock: tipo === "NOTA_CREDITO",
      afecta_caja: true,
      observacion: "",
    },
  })
  const motivos = tipo === "NOTA_CREDITO" ? motivosCredito : motivosDebito

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tipo === "NOTA_CREDITO" ? "Nueva nota de credito" : "Nueva nota de debito"}</DialogTitle>
          <DialogDescription>La nota se generara desde el comprobante aceptado seleccionado.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name="comprobante_referencia_id" render={({ field }) => <FormItem><FormLabel>Comprobante referencia</FormLabel><FormControl><Input readOnly {...field} value={String(field.value || "")} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="motivo_codigo" render={({ field }) => <FormItem><FormLabel>Motivo</FormLabel><Select value={field.value} onValueChange={(value) => { field.onChange(value); form.setValue("motivo_descripcion", motivos.find(([code]) => code === value)?.[1] ?? "") }}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{motivos.map(([code, label]) => <SelectItem key={code} value={code}>{code} {label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />
            <FormField control={form.control} name="motivo_descripcion" render={({ field }) => <FormItem><FormLabel>Descripcion</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField control={form.control} name="afecta_stock" render={({ field }) => <FormItem className="flex items-center justify-between rounded-md border p-3"><FormLabel>Afecta stock</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>} />
              <FormField control={form.control} name="afecta_caja" render={({ field }) => <FormItem className="flex items-center justify-between rounded-md border p-3"><FormLabel>Afecta caja</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>} />
            </div>
            <FormField control={form.control} name="observacion" render={({ field }) => <FormItem><FormLabel>Observacion</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>} />
            <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button disabled={loading} type="submit">{loading ? "Guardando..." : "Guardar"}</Button></DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}