import { CatalogoBasePage } from "@/modules/catalogos/pages/CatalogoBasePage"
import { catalogosConfig } from "@/modules/catalogos/types/catalogo.types"

export function AccionesTerapeuticasPage() {
  return <CatalogoBasePage config={catalogosConfig["acciones-terapeuticas"]} />
}
