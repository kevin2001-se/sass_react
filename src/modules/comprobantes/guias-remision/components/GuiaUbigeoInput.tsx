import type { ComponentProps } from "react"

import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/utils/cn"

const ubigeosFrecuentes = [
  { codigo: "150101", label: "Lima / Lima / Lima" },
  { codigo: "150103", label: "Lima / Lima / Ate" },
  { codigo: "150117", label: "Lima / Lima / Los Olivos" },
  { codigo: "150122", label: "Lima / Lima / Miraflores" },
  { codigo: "150132", label: "Lima / Lima / San Juan de Lurigancho" },
]

type Props = ComponentProps<typeof Input> & {
  error?: boolean
  listId: string
}

export function GuiaUbigeoInput({ error, listId, className, ...props }: Props) {
  return (
    <>
      <Input
        {...props}
        list={listId}
        maxLength={6}
        aria-invalid={!!error}
        className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
        placeholder="150101"
      />
      <datalist id={listId}>
        {ubigeosFrecuentes.map((item) => (
          <option key={item.codigo} value={item.codigo}>{item.label}</option>
        ))}
      </datalist>
      <p className="mt-1 text-xs text-muted-foreground">Busca por codigo. Sugerencias frecuentes muestran departamento / provincia / distrito.</p>
    </>
  )
}
