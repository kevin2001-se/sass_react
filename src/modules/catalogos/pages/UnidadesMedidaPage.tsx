import { CatalogoBasePage } from "@/modules/catalogos/pages/CatalogoBasePage"
import { catalogosConfig } from "@/modules/catalogos/types/catalogo.types"

export function UnidadesMedidaPage() {
  return <CatalogoBasePage config={catalogosConfig["unidades-medida"]} />
}
