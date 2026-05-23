import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { CatalogoDeleteDialog } from "@/modules/catalogos/components/CatalogoDeleteDialog"
import { CatalogoFilters } from "@/modules/catalogos/components/CatalogoFilters"
import { CatalogoFormModal } from "@/modules/catalogos/components/CatalogoFormModal"
import { CatalogoTable } from "@/modules/catalogos/components/CatalogoTable"
import { useCreateCatalogo, useDeleteCatalogo, useUpdateCatalogo } from "@/modules/catalogos/hooks/useCatalogoMutations"
import { useCatalogos } from "@/modules/catalogos/hooks/useCatalogos"
import type { CatalogoAnyFormValues } from "@/modules/catalogos/schemas/catalogo.schema"
import type {
  CatalogoConfig,
  CatalogoFilters as CatalogoFiltersType,
  CatalogoItem,
  CatalogoPayload,
} from "@/modules/catalogos/types/catalogo.types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { getLaravelErrorMessage, getLaravelValidationErrors, type LaravelValidationErrors } from "@/shared/services/api"
import { useAuthStore } from "@/shared/stores/auth.store"

type CatalogoBasePageProps = {
  config: CatalogoConfig
}

function toPayload(values: CatalogoAnyFormValues, config: CatalogoConfig): CatalogoPayload {
  if (config.isUnidadMedida && "simbolo" in values) {
    return {
      nombre: values.nombre,
      descripcion: values.descripcion ?? null,
      abreviatura: values.simbolo,
      estado: values.estado,
    }
  }

  return {
    nombre: values.nombre,
    descripcion: values.descripcion ?? null,
    estado: values.estado,
  }
}

export function CatalogoBasePage({ config }: CatalogoBasePageProps) {
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const [filters, setFilters] = useState<CatalogoFiltersType>({ page: 1, per_page: 15 })
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CatalogoItem | null>(null)
  const [serverErrors, setServerErrors] = useState<LaravelValidationErrors>({})

  const catalogosQuery = useCatalogos(config, filters)
  const createCatalogo = useCreateCatalogo(config)
  const updateCatalogo = useUpdateCatalogo(config)
  const deleteCatalogo = useDeleteCatalogo(config)

  const canCreate = hasPermission(config.permisos.crear)

  function openCreate() {
    setServerErrors({})
    setSelectedItem(null)
    setModalOpen(true)
  }

  function openEdit(item: CatalogoItem) {
    setServerErrors({})
    setSelectedItem(item)
    setModalOpen(true)
  }

  function openDelete(item: CatalogoItem) {
    setSelectedItem(item)
    setDeleteOpen(true)
  }

  async function handleSubmit(values: CatalogoAnyFormValues) {
    try {
      setServerErrors({})
      const payload = toPayload(values, config)

      if (selectedItem) {
        await updateCatalogo.mutateAsync({ id: selectedItem.id, payload })
        toast.success("Registro actualizado correctamente.")
      } else {
        await createCatalogo.mutateAsync(payload)
        toast.success("Registro creado correctamente.")
      }

      setModalOpen(false)
      setSelectedItem(null)
    } catch (error) {
      setServerErrors(getLaravelValidationErrors(error))
      toast.error(getLaravelErrorMessage(error, "No se pudo guardar el registro."))
    }
  }

  async function handleDelete() {
    if (!selectedItem) {
      return
    }

    try {
      await deleteCatalogo.mutateAsync(selectedItem.id)
      toast.success("Registro desactivado correctamente.")
      setDeleteOpen(false)
      setSelectedItem(null)
    } catch (error) {
      toast.error(getLaravelErrorMessage(error, "No se pudo desactivar el registro."))
    }
  }

  const items = catalogosQuery.data?.data ?? []
  const meta = catalogosQuery.data?.meta

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">{config.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Button disabled={!canCreate} onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nuevo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <CatalogoFilters filters={filters} onChange={setFilters} />
        </CardContent>
      </Card>

      {catalogosQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>No se pudieron cargar los registros</AlertTitle>
          <AlertDescription>
            {getLaravelErrorMessage(catalogosQuery.error, "Verifica tus permisos o conexión.")}
          </AlertDescription>
        </Alert>
      )}

      <CatalogoTable
        config={config}
        items={items}
        loading={catalogosQuery.isLoading}
        onDelete={openDelete}
        onEdit={openEdit}
      />

      {meta && (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            Mostrando {meta.from ?? 0}-{meta.to ?? 0} de {meta.total}
          </span>
          <div className="flex gap-2">
            <Button
              disabled={meta.current_page <= 1}
              size="sm"
              variant="outline"
              onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) - 1 }))}
            >
              Anterior
            </Button>
            <Button
              disabled={meta.current_page >= meta.last_page}
              size="sm"
              variant="outline"
              onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) + 1 }))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      <CatalogoFormModal
        config={config}
        item={selectedItem}
        loading={createCatalogo.isPending || updateCatalogo.isPending}
        open={modalOpen}
        serverErrors={serverErrors}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
      />

      <CatalogoDeleteDialog
        item={selectedItem}
        loading={deleteCatalogo.isPending}
        open={deleteOpen}
        onConfirm={handleDelete}
        onOpenChange={setDeleteOpen}
      />
    </div>
  )
}
