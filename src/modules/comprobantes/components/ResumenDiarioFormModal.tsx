import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { resumenDiarioSchema, type ResumenDiarioFormValues } from "@/modules/comprobantes/schemas/resumenDiario.schema"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"

type Props = { open: boolean; loading?: boolean; onOpenChange: (open: boolean) => void; onSubmit: (values: ResumenDiarioFormValues) => void }
export function ResumenDiarioFormModal({ open, loading, onOpenChange, onSubmit }: Props) {
  const form = useForm<ResumenDiarioFormValues>({ resolver: zodResolver(resumenDiarioSchema) as never, defaultValues: { fecha_resumen: new Date().toISOString().slice(0, 10), incluir_boletas: true, incluir_notas_credito: true, incluir_notas_debito: true } })
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Generar resumen diario</DialogTitle><DialogDescription>Incluye boletas y notas asociadas a boletas de la tienda activa.</DialogDescription></DialogHeader><FormProvider {...form}><form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}><FormField control={form.control} name="fecha_resumen" render={({ field }) => <FormItem><FormLabel>Fecha resumen</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />{(["incluir_boletas", "incluir_notas_credito", "incluir_notas_debito"] as const).map((name) => <FormField key={name} control={form.control} name={name} render={({ field }) => <FormItem className="flex items-center gap-3 rounded-md border p-3"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>{name.replaceAll("_", " ")}</FormLabel></FormItem>} />)}<DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button disabled={loading} type="submit">Generar</Button></DialogFooter></form></FormProvider></DialogContent></Dialog>
}