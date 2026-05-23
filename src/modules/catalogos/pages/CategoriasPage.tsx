import { CatalogoBasePage } from "@/modules/catalogos/pages/CatalogoBasePage"
import { catalogosConfig } from "@/modules/catalogos/types/catalogo.types"

export function CategoriasPage() {
  return <CatalogoBasePage config={catalogosConfig.categorias} />
}
