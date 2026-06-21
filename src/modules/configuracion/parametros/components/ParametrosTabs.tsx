import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import type { ParametroGrupo, ParametrosAgrupados } from "@/modules/configuracion/parametros/types/parametro.types"
import { parametroGrupos } from "@/modules/configuracion/parametros/types/parametro.types"

type Props = {
  value: ParametroGrupo
  parametros: ParametrosAgrupados
  onValueChange: (grupo: ParametroGrupo) => void
  renderGroup: (grupo: ParametroGrupo, label: string) => React.ReactNode
}

export function ParametrosTabs({ value, parametros, onValueChange, renderGroup }: Props) {
  return (
    <Tabs value={value} onValueChange={(next) => onValueChange(next as ParametroGrupo)}>
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
        {parametroGrupos.map((grupo) => (
          <TabsTrigger key={grupo.value} value={grupo.value} className="gap-2">
            {grupo.label}
            <span className="rounded-full bg-muted px-1.5 text-[11px] text-muted-foreground">
              {parametros[grupo.value]?.length ?? 0}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {parametroGrupos.map((grupo) => (
        <TabsContent key={grupo.value} value={grupo.value}>
          {renderGroup(grupo.value, grupo.label)}
        </TabsContent>
      ))}
    </Tabs>
  )
}