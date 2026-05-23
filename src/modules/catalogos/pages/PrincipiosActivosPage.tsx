import { CatalogoBasePage } from "@/modules/catalogos/pages/CatalogoBasePage"
import { catalogosConfig } from "@/modules/catalogos/types/catalogo.types"

export function PrincipiosActivosPage() {
  return <CatalogoBasePage config={catalogosConfig["principios-activos"]} />
}
