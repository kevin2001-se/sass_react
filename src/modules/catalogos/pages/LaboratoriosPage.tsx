import { CatalogoBasePage } from "@/modules/catalogos/pages/CatalogoBasePage"
import { catalogosConfig } from "@/modules/catalogos/types/catalogo.types"

export function LaboratoriosPage() {
  return <CatalogoBasePage config={catalogosConfig.laboratorios} />
}
