import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { guiaRemisionSchema, type GuiaRemisionFormValues } from "@/modules/comprobantes/schemas/guiaRemision.schema"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"

type Props = { open: boolean; loading?: boolean; onOpenChange: (open: boolean) => void; onSubmit: (values: GuiaRemisionFormValues) => void }

export function GuiaRemisionFormModal({ open, loading, onOpenChange, onSubmit }: Props) {
  const form = useForm<GuiaRemisionFormValues>({
    resolver: zodResolver(guiaRemisionSchema) as never,
    defaultValues: { fecha_traslado: new Date().toISOString().slice(0, 10), motivo_traslado_codigo: "01", motivo_traslado_descripcion: "VENTA", modalidad_transporte: "02", peso_total: 1, unidad_peso: "KGM", punto_partida_ubigeo: "", punto_partida_direccion: "", punto_llegada_ubigeo: "", punto_llegada_direccion: "", observacion: "" },
  })
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>Nueva guia de remision</DialogTitle><DialogDescription>Completa los datos principales de traslado. Los productos se completaran desde el flujo operativo cuando aplique.</DialogDescription></DialogHeader>
        <FormProvider {...form}>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
            <Field name="fecha_traslado" label="Fecha traslado" type="date" />
            <FormField control={form.control} name="motivo_traslado_codigo" render={({ field }) => <FormItem><FormLabel>Motivo</FormLabel><Select value={field.value} onValueChange={(value) => { field.onChange(value); form.setValue("motivo_traslado_descripcion", value === "01" ? "VENTA" : value === "02" ? "COMPRA" : "TRASLADO") }}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="01">01 VENTA</SelectItem><SelectItem value="02">02 COMPRA</SelectItem><SelectItem value="04">04 TRASLADO</SelectItem><SelectItem value="13">13 OTROS</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
            <Field name="motivo_traslado_descripcion" label="Descripcion motivo" />
            <FormField control={form.control} name="modalidad_transporte" render={({ field }) => <FormItem><FormLabel>Modalidad</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="01">Publico</SelectItem><SelectItem value="02">Privado</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
            <Field name="peso_total" label="Peso total" type="number" />
            <Field name="unidad_peso" label="Unidad peso" />
            <Field name="punto_partida_ubigeo" label="Ubigeo partida" />
            <Field name="punto_llegada_ubigeo" label="Ubigeo llegada" />
            <div className="sm:col-span-2"><Field name="punto_partida_direccion" label="Direccion partida" /></div>
            <div className="sm:col-span-2"><Field name="punto_llegada_direccion" label="Direccion llegada" /></div>
            <div className="sm:col-span-2"><FormField control={form.control} name="observacion" render={({ field }) => <FormItem><FormLabel>Observacion</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>} /></div>
            <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button disabled={loading} type="submit">Guardar</Button></DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

function Field({ name, label, type = "text" }: { name: keyof GuiaRemisionFormValues; label: string; type?: string }) {
  const form = useFormContext<GuiaRemisionFormValues>()
  return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type={type} {...field} value={String(field.value ?? "")} /></FormControl><FormMessage /></FormItem>} />
}