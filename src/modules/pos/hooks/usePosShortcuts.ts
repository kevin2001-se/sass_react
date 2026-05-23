import { useEffect } from "react"

type PosShortcutHandlers = {
  focusSearch?: () => void
  focusPayments?: () => void
  openCustomerModal?: () => void
  openSuspendedSales?: () => void
  suspendSale?: () => void
  tryRegisterSale?: () => void
  confirmClearCart?: () => void
  printLastTicket?: () => void
  closeActiveModal?: () => void
}

function isTypingTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null
  if (!element) return false
  const tag = element.tagName.toLowerCase()
  return tag === "input" || tag === "textarea" || tag === "select" || element.isContentEditable
}

export function usePosShortcuts(handlers: PosShortcutHandlers) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const typing = isTypingTarget(event.target)
      const key = event.key.toLowerCase()

      if (typing && key !== "enter" && key !== "escape") return

      if (event.key === "F2") { event.preventDefault(); handlers.focusSearch?.() }
      if (event.key === "F4") { event.preventDefault(); handlers.focusPayments?.() }
      if (event.key === "F6") { event.preventDefault(); handlers.openCustomerModal?.() }
      if (event.key === "F8") { event.preventDefault(); handlers.openSuspendedSales?.() }
      if (event.key === "F9") { event.preventDefault(); handlers.suspendSale?.() }
      if (event.key === "F10") { event.preventDefault(); handlers.tryRegisterSale?.() }
      if (event.key === "Escape") { handlers.closeActiveModal?.() }
      if (event.ctrlKey && key === "l") { event.preventDefault(); handlers.confirmClearCart?.() }
      if (event.ctrlKey && key === "p") { event.preventDefault(); handlers.printLastTicket?.() }
      if (event.ctrlKey && key === "enter") { event.preventDefault(); handlers.tryRegisterSale?.() }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handlers])
}