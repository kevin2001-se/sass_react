import { Skeleton } from "@/shared/components/ui/skeleton"

export function PosSearchSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton className="h-24 w-full" key={index} />
      ))}
    </div>
  )
}

