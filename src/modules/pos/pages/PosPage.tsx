import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { PosActions } from "@/modules/pos/components/PosActions"
import { PosCajaAlert } from "@/modules/pos/components/PosCajaAlert"
import { PosCart } from "@/modules/pos/components/PosCart"
import { PosCustomerPanel } from "@/modules/pos/components/PosCustomerPanel"
import { PosErrorBoundary } from "@/modules/pos/components/PosErrorBoundary"
import { PosHeader } from "@/modules/pos/components/PosHeader"
import { PosPaymentPanel } from "@/modules/pos/components/PosPaymentPanel"
import { PosQuickActionBar } from "@/modules/pos/components/PosQuickActionBar"
import { PosRestoreDraftDialog } from "@/modules/pos/components/PosRestoreDraftDialog"
import { PosSearchPanel } from "@/modules/pos/components/PosSearchPanel"
import { PosSummary } from "@/modules/pos/components/PosSummary"
import { PosSuspendedSalesModal } from "@/modules/pos/components/PosSuspendedSalesModal"
import { PosRefsProvider } from "@/modules/pos/context/PosRefsContext"
import { useCajaAbiertaForPos } from "@/modules/pos/hooks/useCajaAbiertaForPos"
import { usePosDraft } from "@/modules/pos/hooks/usePosDraft"
import { usePosShortcuts } from "@/modules/pos/hooks/usePosShortcuts"
import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { posDocumentoService } from "@/modules/pos/services/posDocumento.service"
import { selectLastSale, selectPosCliente, selectPosItems, selectPosPagos } from "@/modules/pos/stores/pos.selectors"
import { openBlob } from "@/modules/pos/utils/downloadBlob"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

function PosPageContent() {
  const cajaQuery = useCajaAbiertaForPos()
  const clearCart = usePosStore((state) => state.clearCart)
  const items = usePosStore(selectPosItems)
  const cliente = usePosStore(selectPosCliente)
  const pagos = usePosStore(selectPosPagos)
  const tipoComprobante = usePosStore((state) => state.tipoComprobante)
  const tipoVenta = usePosStore((state) => state.tipoVenta)
  const observacion = usePosStore((state) => state.observacion)
  const puedeCobrar = usePosStore((state) => state.puedeCobrar)
  const lastSale = usePosStore(selectLastSale)
  const suspendCurrentSale = usePosStore((state) => state.suspendCurrentSale)
  const validateBeforeRegister = usePosStore((state) => state.validateBeforeRegister)
  const restoreDraft = usePosStore((state) => state.restoreDraft)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const paymentPanelRef = useRef<HTMLDivElement | null>(null)
  const customerButtonRef = useRef<HTMLButtonElement | null>(null)
  const registerButtonRef = useRef<HTMLButtonElement | null>(null)
  const refs = useMemo(() => ({ searchInputRef, paymentPanelRef, customerButtonRef, registerButtonRef }), [])
  const [mobileCartOpen, setMobileCartOpen] = useState(false)
  const [suspendedOpen, setSuspendedOpen] = useState(false)
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const [restoreDraftOpen, setRestoreDraftOpen] = useState(false)

  const draftSnapshot = useMemo(() => ({ cliente, items, pagos, tipoComprobante, tipoVenta, observacion }), [cliente, items, observacion, pagos, tipoComprobante, tipoVenta])
  const { draft, getDraft, clearDraft } = usePosDraft(draftSnapshot, true)

  useEffect(() => {
    if (draft && draft.items.length > 0 && items.length === 0) {
      setRestoreDraftOpen(true)
    }
  }, [draft, items.length])

  const focusSearch = useCallback(() => searchInputRef.current?.focus(), [])
  const focusPayments = useCallback(() => paymentPanelRef.current?.focus(), [])
  const openCustomerModal = useCallback(() => customerButtonRef.current?.click(), [])
  const openSuspendedSales = useCallback(() => setSuspendedOpen(true), [])
  const confirmClearCart = useCallback(() => {
    if (items.length === 0) return
    setClearConfirmOpen(true)
  }, [items.length])
  const tryRegisterSale = useCallback(() => {
    const validation = validateBeforeRegister(Boolean(cajaQuery.data))
    if (!validation.ok) {
      toast.error(validation.message)
      return
    }
    if (!puedeCobrar) {
      toast.error("Completa el pago para registrar.")
      return
    }
    registerButtonRef.current?.click()
  }, [cajaQuery.data, puedeCobrar, validateBeforeRegister])
  const suspendSale = useCallback(() => {
    const result = suspendCurrentSale()
    if (!result.ok) toast.error(result.message)
    else toast.success("Venta suspendida correctamente.")
  }, [suspendCurrentSale])
  const printLastTicket = useCallback(async () => {
    const comprobanteId = lastSale?.comprobante_electronico?.id
    if (!comprobanteId) {
      toast.error("No hay ultimo ticket disponible.")
      return
    }
    try {
      await posDocumentoService.generarTicket80(comprobanteId)
      openBlob(await posDocumentoService.descargarTicket80(comprobanteId))
    } catch {
      toast.error("No se pudo imprimir el ultimo ticket.")
    }
  }, [lastSale])
  const closeActiveModal = useCallback(() => {
    setSuspendedOpen(false)
    setMobileCartOpen(false)
    setRestoreDraftOpen(false)
    searchInputRef.current?.blur()
  }, [])

  usePosShortcuts({
    focusSearch,
    focusPayments,
    openCustomerModal,
    openSuspendedSales,
    suspendSale,
    tryRegisterSale,
    confirmClearCart,
    printLastTicket,
    closeActiveModal,
  })

  return (
    <PosRefsProvider value={refs}>
      <div className="flex min-h-screen flex-col pb-24 lg:pb-0">
        <PosHeader caja={cajaQuery.data} isCajaLoading={cajaQuery.isLoading} />

        <main className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="min-w-0 space-y-3">
            {!cajaQuery.data && !cajaQuery.isLoading && <PosCajaAlert />}
            {cajaQuery.isError && (
              <Alert variant="destructive">
                <AlertTitle>No se pudo validar la caja</AlertTitle>
                <AlertDescription>Revise la conexion con la API.</AlertDescription>
              </Alert>
            )}
            <PosQuickActionBar onOpenSuspended={openSuspendedSales} onTryRegister={tryRegisterSale} />

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-3">
                <PosSearchPanel inputRef={searchInputRef} />
                <div className="xl:hidden">
                  <Tabs defaultValue="cliente">
                    <TabsList>
                      <TabsTrigger value="cliente">Cliente</TabsTrigger>
                      <TabsTrigger value="pagos">Pagos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="cliente"><PosCustomerPanel /></TabsContent>
                    <TabsContent value="pagos"><PosPaymentPanel cajaAbierta={Boolean(cajaQuery.data)} /></TabsContent>
                  </Tabs>
                </div>
              </div>
              <div className="hidden space-y-3 xl:block">
                <PosCustomerPanel />
                <PosPaymentPanel cajaAbierta={Boolean(cajaQuery.data)} />
              </div>
            </div>
          </section>

          <aside className="hidden min-h-0 flex-col gap-3 lg:flex">
            <PosCart />
            <PosSummary />
            <PosActions cajaAbierta={Boolean(cajaQuery.data)} onSuspendedOpenChange={setSuspendedOpen} />
          </aside>

          <div className="fixed bottom-16 left-3 right-3 z-20 lg:hidden">
            <div className="rounded-lg border bg-background p-2 shadow-lg">
              <PosSummary />
              <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                <PosActions cajaAbierta={Boolean(cajaQuery.data)} onSuspendedOpenChange={setSuspendedOpen} />
                <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
                  <SheetTrigger asChild>
                    <Button aria-label="Abrir carrito" className="h-full" variant="outline"><ShoppingCart className="h-5 w-5" /></Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="h-screen w-full sm:max-w-md">
                    <SheetHeader><SheetTitle>Carrito</SheetTitle></SheetHeader>
                    <div className="mt-4 h-[calc(100vh-6rem)]"><PosCart /></div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </main>

        <PosSuspendedSalesModal open={suspendedOpen} onOpenChange={setSuspendedOpen} showTrigger={false} />
        <PosRestoreDraftDialog
          open={restoreDraftOpen}
          draft={draft}
          onOpenChange={setRestoreDraftOpen}
          onDiscard={() => {
            clearDraft()
            setRestoreDraftOpen(false)
          }}
          onRestore={() => {
            const currentDraft = getDraft()
            if (currentDraft) {
              restoreDraft(currentDraft)
              clearDraft()
              toast.success("Venta anterior restaurada.")
            }
            setRestoreDraftOpen(false)
            focusSearch()
          }}
        />
        <AlertDialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Limpiar carrito</AlertDialogTitle>
              <AlertDialogDescription>Ctrl + L necesita confirmacion. Se quitaran productos y pagos de la venta actual.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => { clearCart(); setClearConfirmOpen(false); focusSearch() }}>Limpiar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PosRefsProvider>
  )
}

export function PosPage() {
  return (
    <PosErrorBoundary>
      <PosPageContent />
    </PosErrorBoundary>
  )
}
