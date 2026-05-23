import { memo, type KeyboardEvent, useEffect, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"

import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

type Props = { itemKey: string; quantity: number }

export const PosItemQuantityControl = memo(function PosItemQuantityControl({ itemKey, quantity }: Props) {
  const increaseItem = usePosStore((state) => state.increaseItem)
  const decreaseItem = usePosStore((state) => state.decreaseItem)
  const updateItemQuantity = usePosStore((state) => state.updateItemQuantity)
  const [value, setValue] = useState(String(quantity))

  useEffect(() => setValue(String(quantity)), [quantity])

  function run(action: () => { ok: boolean; message?: string }) {
    const result = action()
    if (!result.ok) toast.error(result.message)
  }

  function commit() {
    const next = Number(value)
    if (!Number.isFinite(next) || next <= 0) {
      setValue(String(quantity))
      toast.error("La cantidad debe ser mayor a 0.")
      return
    }
    run(() => updateItemQuantity(itemKey, next))
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur()
      commit()
    }
  }

  return (
    <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2">
      <Button aria-label="Disminuir cantidad" size="icon" variant="outline" onClick={() => run(() => decreaseItem(itemKey))}><Minus className="h-3.5 w-3.5" /></Button>
      <Input aria-label="Cantidad" className="h-9 text-center font-semibold" inputMode="decimal" value={value} onBlur={commit} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} />
      <Button aria-label="Aumentar cantidad" size="icon" variant="outline" onClick={() => run(() => increaseItem(itemKey))}><Plus className="h-3.5 w-3.5" /></Button>
    </div>
  )
})