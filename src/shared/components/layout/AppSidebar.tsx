import * as React from "react"
import {
  BarChart3,
  Boxes,
  Building2,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  FileText,
  FlaskConical,
  History,
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  Ruler,
  SendToBack,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Sun,
  Tags,
  TestTube2,
  WalletCards,
  type LucideIcon,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/shared/components/ui/sidebar"
import { useAuthStore } from "@/shared/stores/auth.store"
import { cn } from "@/shared/utils/cn"

type SidebarNavItem = {
  label: string
  path: string
  icon?: LucideIcon
  permission?: string | string[]
}

type SidebarNavGroup = {
  label: string
  icon: LucideIcon
  children: SidebarNavItem[]
}

const dashboardItem: SidebarNavItem = {
  label: "Dashboard",
  path: "/dashboard",
  icon: LayoutDashboard,
}

const sidebarGroups: SidebarNavGroup[] = [
  {
    label: "Catalogos",
    icon: Tags,
    children: [
      { label: "Productos", path: "/productos", icon: Package, permission: "productos.ver" },
      { label: "Categorias", path: "/catalogos/categorias", permission: "categorias.ver" },
      { label: "Marcas", path: "/catalogos/marcas", permission: "marcas.ver" },
      { label: "Laboratorios", path: "/catalogos/laboratorios", icon: FlaskConical, permission: "laboratorios.ver" },
      { label: "Principios activos", path: "/catalogos/principios-activos", icon: TestTube2, permission: "principios_activos.ver" },
      { label: "Acciones terapeuticas", path: "/catalogos/acciones-terapeuticas", icon: TestTube2, permission: "acciones_terapeuticas.ver" },
      { label: "Unidades de medida", path: "/catalogos/unidades-medida", icon: Ruler, permission: "unidades_medida.ver" },
    ],
  },
  {
    label: "Inventario",
    icon: Boxes,
    children: [
      { label: "Stock actual", path: "/inventario/stock", permission: "inventario.ver" },
      { label: "Lotes", path: "/inventario/lotes", icon: Package, permission: "lotes.ver" },
      { label: "Vencimientos", path: "/inventario/vencimientos", icon: CalendarClock, permission: "inventario.ver" },
      { label: "Entrada", path: "/inventario/entrada", icon: LogIn, permission: "inventario.entrada" },
      { label: "Salida", path: "/inventario/salida", icon: LogOut, permission: "inventario.salida" },
      { label: "Ajuste", path: "/inventario/ajuste", icon: SlidersHorizontal, permission: "inventario.ajuste" },
      { label: "Kardex", path: "/inventario/kardex", icon: History, permission: "inventario.kardex" },
    ],
  },
  {
    label: "Ventas",
    icon: ShoppingCart,
    children: [
      { label: "POS", path: "/ventas/pos", permission: "ventas.crear" },
      { label: "Historial de ventas", path: "/ventas/historial", icon: History, permission: "ventas.ver" },
      { label: "Devoluciones / anulaciones", path: "/ventas/devoluciones", permission: "ventas.ver" },
    ],
  },
  {
    label: "Caja",
    icon: WalletCards,
    children: [
      { label: "Caja actual", path: "/caja", permission: "caja.ver" },
      { label: "Historial", path: "/caja/historial", icon: History, permission: "caja.historial" },
    ],
  },
  {
    label: "Comprobantes",
    icon: FileText,
    children: [
      { label: "Notas de venta", path: "/comprobantes/notas-venta", permission: "comprobantes.notas_venta.ver" },
      { label: "Boletas", path: "/comprobantes/boletas", permission: "sunat.comprobantes.ver" },
      { label: "Facturas", path: "/comprobantes/facturas", permission: "sunat.comprobantes.ver" },
      { label: "Notas de credito", path: "/comprobantes/notas-credito", permission: ["sunat.notas.ver", "notas_credito.ver"] },
      { label: "Nueva nota credito", path: "/comprobantes/notas-credito/nueva", permission: ["sunat.notas.crear", "notas_credito.crear"] },
      { label: "Notas de debito", path: "/comprobantes/notas-debito", permission: ["sunat.notas.ver", "notas_debito.ver"] },
      { label: "Nueva nota debito", path: "/comprobantes/notas-debito/nueva", permission: ["sunat.notas.crear", "notas_debito.crear"] },
      { label: "Guias de remision", path: "/comprobantes/guias-remision", icon: SendToBack, permission: "sunat.guias.ver" },
      { label: "Nueva desde venta", path: "/comprobantes/guias-remision/desde-venta", permission: "sunat.guias.ver" },
      { label: "Resumen diario", path: "/comprobantes/resumen-diario", icon: ClipboardList, permission: "sunat.resumenes.ver" },
      { label: "Comunicacion de baja", path: "/comprobantes/comunicacion-baja", icon: LogOut, permission: "sunat.bajas.ver" },
    ],
  },
  {
    label: "Reportes",
    icon: BarChart3,
    children: [
      { label: "Ventas", path: "/reportes/ventas", permission: "reportes.ver" },
      { label: "Compras", path: "/reportes/compras", permission: "reportes.ver" },
      { label: "Inventario", path: "/reportes/inventario", permission: "reportes.ver" },
      { label: "Caja", path: "/reportes/caja", permission: "reportes.ver" },
      { label: "Financiero", path: "/reportes/financiero", permission: "reportes.ver" },
    ],
  },
  {
    label: "Configuracion",
    icon: Settings,
    children: [
      { label: "Empresa", path: "/configuracion/empresa" },
      { label: "Tiendas", path: "/configuracion/tiendas" },
      { label: "Usuarios", path: "/configuracion/usuarios" },
      { label: "Roles y permisos", path: "/configuracion/roles-permisos" },
      { label: "Series", path: "/configuracion/series" },
      { label: "SUNAT", path: "/configuracion/sunat", icon: Sun, permission: "sunat.configuracion.ver" },
      { label: "Parametros", path: "/configuracion/parametros" },
    ],
  },
]

function isActiveItem(pathname: string, path: string) {
  if (path === "/dashboard") {
    return pathname === path || pathname === "/"
  }

  if (path === "/productos") {
    return pathname === path || pathname.startsWith("/productos/")
  }

  return pathname === path
}

function isActiveGroup(pathname: string, children: SidebarNavItem[]) {
  return children.some((item) => isActiveItem(pathname, item.path))
}

function AppSidebarItem({ item, onNavigate }: { item: SidebarNavItem; onNavigate: () => void }) {
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <NavLink to={item.path} onClick={onNavigate}>
        {({ isActive }) => (
          <SidebarMenuButton
            asChild
            isActive={isActive}
            className={cn(
              "relative h-9 rounded-md text-sidebar-foreground/75",
              isActive &&
                "border-l-2 border-indigo-600 bg-indigo-50 pl-[7px] text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
            )}
          >
            <span>
              {Icon ? <Icon className="h-4 w-4 shrink-0" /> : <span className="ml-1 h-1.5 w-1.5 rounded-full bg-current opacity-50" />}
              <span className="truncate">{item.label}</span>
            </span>
          </SidebarMenuButton>
        )}
      </NavLink>
    </SidebarMenuItem>
  )
}

function AppSidebarGroup({
  group,
  defaultOpen,
  onNavigate,
}: {
  group: SidebarNavGroup
  defaultOpen: boolean
  onNavigate: () => void
}) {
  const GroupIcon = group.icon
  const [open, setOpen] = React.useState(defaultOpen)

  React.useEffect(() => {
    if (defaultOpen) {
      setOpen(true)
    }
  }, [defaultOpen])

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm font-semibold text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          defaultOpen && "bg-sidebar-accent text-sidebar-accent-foreground",
        )}
        aria-expanded={open}
      >
        <GroupIcon className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-left">{group.label}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <SidebarMenu className="ml-2 border-l border-sidebar-border pl-2">
          {group.children.map((item) => (
            <AppSidebarItem key={item.path} item={item} onNavigate={onNavigate} />
          ))}
        </SidebarMenu>
      )}
    </div>
  )
}

export function AppSidebar() {
  const location = useLocation()
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const { isMobile, setOpenMobile } = useSidebar()

  const onNavigate = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, setOpenMobile])

  const canShowItem = React.useCallback(
    (item: SidebarNavItem) => !item.permission || (Array.isArray(item.permission) ? hasAnyPermission(item.permission) : hasPermission(item.permission)),
    [hasAnyPermission, hasPermission],
  )

  const visibleGroups = React.useMemo(
    () =>
      sidebarGroups
        .map((group) => ({ ...group, children: group.children.filter(canShowItem) }))
        .filter((group) => group.children.length > 0),
    [canShowItem],
  )

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-none">Botica SaaS</p>
            <p className="mt-1 truncate text-xs text-sidebar-foreground/60">Multiempresa y multitienda</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-3">
        {canShowItem(dashboardItem) && (
          <SidebarMenu>
            <AppSidebarItem item={dashboardItem} onNavigate={onNavigate} />
          </SidebarMenu>
        )}

        <div className="space-y-1">
          {visibleGroups.map((group) => (
            <AppSidebarGroup
              key={group.label}
              group={group}
              defaultOpen={isActiveGroup(location.pathname, group.children)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border border-sidebar-border bg-background px-3 py-2",
            "text-xs text-muted-foreground",
          )}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Operacion por tienda</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}


