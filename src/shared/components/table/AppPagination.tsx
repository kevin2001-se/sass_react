import { Button } from "@/shared/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

const perPageOptions = [10, 15, 25, 50]

type AppPaginationProps = {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

function visiblePages(currentPage: number, lastPage: number) {
  const pages = new Set<number>([1, lastPage, currentPage, currentPage - 1, currentPage + 1])
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= lastPage)
    .sort((a, b) => a - b)
}

export function AppPagination({ currentPage, lastPage, perPage, total, onPageChange, onPerPageChange }: AppPaginationProps) {
  const pages = visiblePages(currentPage, lastPage)
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1
  const to = Math.min(currentPage * perPage, total)

  return (
    <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-muted-foreground">
        Mostrando {from}-{to} de {total} registros
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filas</span>
          <Select value={String(perPage)} onValueChange={(value) => onPerPageChange(Number(value))}>
            <SelectTrigger className="h-9 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious disabled={currentPage <= 1} onClick={() => onPageChange(Math.max(1, currentPage - 1))} />
            </PaginationItem>
            {pages.map((page, index) => {
              const previous = pages[index - 1]
              return (
                <PaginationItem key={page} className="flex items-center gap-1">
                  {previous && page - previous > 1 ? <PaginationEllipsis /> : null}
                  <PaginationLink isActive={page === currentPage} onClick={() => onPageChange(page)}>{page}</PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext disabled={currentPage >= lastPage} onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {lastPage <= 1 ? (
          <Button className="hidden" disabled variant="ghost" />
        ) : null}
      </div>
    </div>
  )
}