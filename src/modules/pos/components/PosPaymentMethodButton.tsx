import { memo } from "react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"

export const PosPaymentMethodButton = memo(function PosPaymentMethodButton({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  icon: LucideIcon
  label: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <Button className="h-12 justify-start" disabled={disabled} type="button" variant="outline" onClick={onClick}>
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  )
})
