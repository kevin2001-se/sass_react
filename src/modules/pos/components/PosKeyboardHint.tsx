import { memo } from "react"
import { cn } from "@/shared/utils/cn"

export const PosKeyboardHint = memo(function PosKeyboardHint({ keys, className }: { keys: string; className?: string }) {
  return (
    <kbd className={cn("ml-2 rounded border bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground", className)}>
      {keys}
    </kbd>
  )
})
