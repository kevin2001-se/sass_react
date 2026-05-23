import { createContext, createRef, useContext, useMemo, type ReactNode, type RefObject } from "react"

type PosRefsContextValue = {
  searchInputRef: RefObject<HTMLInputElement | null>
  paymentPanelRef: RefObject<HTMLDivElement | null>
  customerButtonRef: RefObject<HTMLButtonElement | null>
  registerButtonRef: RefObject<HTMLButtonElement | null>
}

const fallbackRefs: PosRefsContextValue = {
  searchInputRef: createRef<HTMLInputElement | null>(),
  paymentPanelRef: createRef<HTMLDivElement | null>(),
  customerButtonRef: createRef<HTMLButtonElement | null>(),
  registerButtonRef: createRef<HTMLButtonElement | null>(),
}

const PosRefsContext = createContext<PosRefsContextValue>(fallbackRefs)

export function PosRefsProvider({ children, value }: { children: ReactNode; value: PosRefsContextValue }) {
  const refs = useMemo(() => value, [value])
  return <PosRefsContext.Provider value={refs}>{children}</PosRefsContext.Provider>
}

export function usePosRefs() {
  return useContext(PosRefsContext)
}