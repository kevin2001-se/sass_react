import { CatalogoBasePage } from "@/modules/catalogos/pages/CatalogoBasePage"
import { catalogosConfig } from "@/modules/catalogos/types/catalogo.types"

export function MarcasPage() {
  return <CatalogoBasePage config={catalogosConfig.marcas} />
}
