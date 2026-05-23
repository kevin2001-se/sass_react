import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { comunicacionBajaSchema, type ComunicacionBajaFormValues } from "@/modules/comprobantes/schemas/comunicacionBaja.schema"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"

type Props = { open: boolean; loading?: boolean; onOpenChange: (open: boolean) => void; onSubmit: (values: ComunicacionBajaFormValues) => void }
export function ComunicacionBajaFormModal({ open, loading, onOpenChange, onSubmit }: Props) {
  const form = useForm<ComunicacionBajaFormValues>({ resolver: zodResolver(comunicacionBajaSchema) as never, defaultValues: { fecha_baja: new Date().toISOString().slice(0, 10), comprobante_electronico_id: 0, motivo_baja: "" } })
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Generar comunicacion de baja</DialogTitle><DialogDescription>Registra un comprobante aceptado para darlo de baja en SUNAT.</DialogDescription></DialogHeader><FormProvider {...form}><form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}><FormField control={form.control} name="fecha_baja" render={({ field }) => <FormItem><FormLabel>Fecha baja</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="comprobante_electronico_id" render={({ field }) => <FormItem><FormLabel>ID comprobante electronico</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="motivo_baja" render={({ field }) => <FormItem><FormLabel>Motivo</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} /><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button disabled={loading} type="submit">Generar</Button></DialogFooter></form></FormProvider></DialogContent></Dialog>
}