import * as React from "react"
import { PanelLeft } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Sheet, SheetContent } from "@/shared/components/ui/sheet"
import { useMobile } from "@/shared/hooks/use-mobile"
import { cn } from "@/shared/utils/cn"

type SidebarContextValue = {
  isMobile: boolean
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({ className, children, ...props }: React.ComponentProps<"div">) {
  const isMobile = useMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ isMobile, openMobile, setOpenMobile }}>
      <div
        className={cn(
          "group/sidebar-wrapper flex min-h-screen w-full bg-background text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({ className, children, ...props }: React.ComponentProps<"aside">) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-72 border-r bg-sidebar p-0 text-sidebar-foreground">
          <aside className={cn("flex h-full flex-col", className)} {...props}>
            {children}
          </aside>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen w-72 shrink-0 border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main className={cn("flex min-w-0 flex-1 flex-col", className)} {...props} />
}

function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { setOpenMobile } = useSidebar()

  return (
    <Button
      className={cn("md:hidden", className)}
      size="icon"
      type="button"
      variant="ghost"
      onClick={() => setOpenMobile(true)}
      {...props}
    >
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Abrir menú</span>
    </Button>
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("border-b p-3", className)} {...props} />
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-3", className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("border-t p-3", className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1", className)} {...props} />
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-medium text-sidebar-foreground/60", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("space-y-1", className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("list-none", className)} {...props} />
}

function SidebarMenuButton({
  className,
  isActive,
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  isActive?: boolean
  asChild?: boolean
}) {
  const classes = cn(
    "flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm font-medium text-sidebar-foreground/80 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
    className,
  )

  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className),
    })
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  )
}

function SidebarRail() {
  return null
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
}
