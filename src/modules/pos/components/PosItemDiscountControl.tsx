import { memo, type KeyboardEvent, useEffect, useState } from "react"
import { toast } from "sonner"

import { usePosStore } from "@/modules/pos/hooks/usePosStore"
import { Input } from "@/shared/components/ui/input"

type Props = { itemKey: string; discount: number }

export const PosItemDiscountControl = memo(function PosItemDiscountControl({ itemKey, discount }: Props) {
  const updateItemDiscount = usePosStore((state) => state.updateItemDiscount)
  const [value, setValue] = useState(String(discount))

  useEffect(() => setValue(String(discount)), [discount])

  function commit() {
    const next = Number(value || 0)
    if (!Number.isFinite(next) || next < 0) {
      setValue(String(discount))
      toast.error("El descuento no puede ser menor a 0.")
      return
    }
    const result = updateItemDiscount(itemKey, next)
    if (!result.ok) {
      setValue(String(discount))
      toast.error(result.message)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur()
      commit()
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <label className="text-xs font-medium text-muted-foreground" htmlFor={`discount-${itemKey}`}>Descuento</label>
      <Input id={`discount-${itemKey}`} aria-label="Descuento" className="h-9" inputMode="decimal" value={value} onBlur={commit} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} />
    </div>
  )
})