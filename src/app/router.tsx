import { createBrowserRouter, Navigate } from "react-router-dom"

import { PermissionRoute } from "@/app/PermissionRoute"
import { ProtectedRoute } from "@/app/ProtectedRoute"
import { AppLayout } from "@/layouts/AppLayout"
import { AuthLayout } from "@/layouts/AuthLayout"
import { PosLayout } from "@/layouts/PosLayout"
import { LoginPage } from "@/modules/auth/pages/LoginPage"
import { SelectStorePage } from "@/modules/auth/pages/SelectStorePage"
import { CajaHistorialPage } from "@/modules/caja/pages/CajaHistorialPage"
import { CajaPage } from "@/modules/caja/pages/CajaPage"
import { AccionesTerapeuticasPage } from "@/modules/catalogos/pages/AccionesTerapeuticasPage"
import { CategoriasPage } from "@/modules/catalogos/pages/CategoriasPage"
import { LaboratoriosPage } from "@/modules/catalogos/pages/LaboratoriosPage"
import { MarcasPage } from "@/modules/catalogos/pages/MarcasPage"
import { PrincipiosActivosPage } from "@/modules/catalogos/pages/PrincipiosActivosPage"
import { UnidadesMedidaPage } from "@/modules/catalogos/pages/UnidadesMedidaPage"
import { BoletasPage } from "@/modules/comprobantes/pages/BoletasPage"
import { ComprobanteDetailPage } from "@/modules/comprobantes/pages/ComprobanteDetailPage"
import { ComunicacionBajaPage } from "@/modules/comprobantes/comunicacion-baja/pages/ComunicacionBajaPage"
import { ComunicacionBajaDetailPage } from "@/modules/comprobantes/comunicacion-baja/pages/ComunicacionBajaDetailPage"
import { FacturasPage } from "@/modules/comprobantes/pages/FacturasPage"
import { GuiasRemisionPage } from "@/modules/comprobantes/pages/GuiasRemisionPage"
import { GuiaRemisionDetailPage } from "@/modules/comprobantes/guias-remision/pages/GuiaRemisionDetailPage"
import { GuiaRemisionCreatePage } from "@/modules/comprobantes/guias-remision/pages/GuiaRemisionCreatePage"
import { GuiaDesdeVentaPage } from "@/modules/comprobantes/guias-remision/pages/GuiaDesdeVentaPage"
import { NotasCreditoPage } from "@/modules/comprobantes/pages/NotasCreditoPage"
import { NotaCreditoDetailPage } from "@/modules/comprobantes/notas-credito/pages/NotaCreditoDetailPage"
import { NotaCreditoCreatePage } from "@/modules/comprobantes/notas-credito/pages/NotaCreditoCreatePage"
import { NotasDebitoPage } from "@/modules/comprobantes/pages/NotasDebitoPage"
import { NotaDebitoDetailPage } from "@/modules/comprobantes/notas-debito/pages/NotaDebitoDetailPage"
import { NotaDebitoCreatePage } from "@/modules/comprobantes/notas-debito/pages/NotaDebitoCreatePage"
import { NotasVentaPage } from "@/modules/comprobantes/pages/NotasVentaPage"
import { ResumenDiarioPage } from "@/modules/comprobantes/resumen-diario/pages/ResumenDiarioPage"
import { ResumenDiarioDetailPage } from "@/modules/comprobantes/resumen-diario/pages/ResumenDiarioDetailPage"
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage"
import { EmpresaPage } from "@/modules/configuracion/empresa/pages/EmpresaPage"
import { RolesPage } from "@/modules/configuracion/roles/pages/RolesPage"
import { SeriesPage } from "@/modules/configuracion/series/pages/SeriesPage"
import { ParametrosPage } from "@/modules/configuracion/parametros/pages/ParametrosPage"
import { SunatConfiguracionPage } from "@/modules/configuracion/sunat/pages/SunatConfiguracionPage"
import { TiendasPage } from "@/modules/configuracion/tiendas/pages/TiendasPage"
import { UsuariosPage } from "@/modules/configuracion/usuarios/pages/UsuariosPage"
import { AjusteInventarioPage } from "@/modules/inventario/pages/AjusteInventarioPage"
import { EntradaInventarioPage } from "@/modules/inventario/pages/EntradaInventarioPage"
import { KardexPage } from "@/modules/inventario/pages/KardexPage"
import { LotesPage } from "@/modules/inventario/pages/LotesPage"
import { SalidaInventarioPage } from "@/modules/inventario/pages/SalidaInventarioPage"
import { StockPage } from "@/modules/inventario/pages/StockPage"
import { VencimientosPage } from "@/modules/inventario/pages/VencimientosPage"
import { ProductoCreatePage } from "@/modules/productos/pages/ProductoCreatePage"
import { ProductoDetailPage } from "@/modules/productos/pages/ProductoDetailPage"
import { ProductoEditPage } from "@/modules/productos/pages/ProductoEditPage"
import { ProductosPage } from "@/modules/productos/pages/ProductosPage"
import { PosPage } from "@/modules/pos/pages/PosPage"
import { CompraCreatePage } from "@/modules/compras/compras/pages/CompraCreatePage"
import { CompraDetailPage } from "@/modules/compras/compras/pages/CompraDetailPage"
import { ComprasHistorialPage } from "@/modules/compras/compras/pages/ComprasHistorialPage"
import { CuentasPagarPage } from "@/modules/compras/cuentas-pagar/pages/CuentasPagarPage"
import { CuentaPagarDetailPage } from "@/modules/compras/cuentas-pagar/pages/CuentaPagarDetailPage"
import { PagoProveedorCreatePage } from "@/modules/compras/pagos-proveedor/pages/PagoProveedorCreatePage"
import { PagoProveedorDetailPage } from "@/modules/compras/pagos-proveedor/pages/PagoProveedorDetailPage"
import { PagosProveedorPage } from "@/modules/compras/pagos-proveedor/pages/PagosProveedorPage"
import { ProveedoresPage } from "@/modules/compras/proveedores/pages/ProveedoresPage"
import { CuentasCobrarPage } from "@/modules/ventas/cuentas-cobrar/pages/CuentasCobrarPage"
import { CuentaCobrarDetailPage } from "@/modules/ventas/cuentas-cobrar/pages/CuentaCobrarDetailPage"
import { PagosClientePage } from "@/modules/ventas/cuentas-cobrar/pages/PagosClientePage"
import { ReporteCajaPage } from "@/modules/reportes/pages/ReporteCajaPage"
import { ReporteComprasPage } from "@/modules/reportes/pages/ReporteComprasPage"
import { ReporteFinancieroPage } from "@/modules/reportes/pages/ReporteFinancieroPage"
import { ReporteInventarioPage } from "@/modules/reportes/pages/ReporteInventarioPage"
import { ReporteVentasPage } from "@/modules/reportes/pages/ReporteVentasPage"
import { ReportesPage } from "@/modules/reportes/pages/ReportesPage"
import { VentaDetailPage } from "@/modules/ventas/pages/VentaDetailPage"
import { VentasHistorialPage } from "@/modules/ventas/pages/VentasHistorialPage"
import { PlaceholderPage } from "@/shared/components/layout/PlaceholderPage"
import { ForbiddenPage } from "@/shared/pages/ForbiddenPage"

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/seleccionar-tienda", element: <SelectStorePage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PosLayout />,
        children: [
          {
            element: <PermissionRoute permission="ventas.crear" />,
            children: [{ path: "/ventas/pos", element: <PosPage /> }],
          },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Navigate to="/dashboard" replace /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/403", element: <ForbiddenPage /> },

          {
            element: <PermissionRoute permission="categorias.ver" />,
            children: [{ path: "/catalogos/categorias", element: <CategoriasPage /> }],
          },
          {
            element: <PermissionRoute permission="marcas.ver" />,
            children: [{ path: "/catalogos/marcas", element: <MarcasPage /> }],
          },
          {
            element: <PermissionRoute permission="laboratorios.ver" />,
            children: [{ path: "/catalogos/laboratorios", element: <LaboratoriosPage /> }],
          },
          {
            element: <PermissionRoute permission="principios_activos.ver" />,
            children: [{ path: "/catalogos/principios-activos", element: <PrincipiosActivosPage /> }],
          },
          {
            element: <PermissionRoute permission="acciones_terapeuticas.ver" />,
            children: [{ path: "/catalogos/acciones-terapeuticas", element: <AccionesTerapeuticasPage /> }],
          },
          {
            element: <PermissionRoute permission="unidades_medida.ver" />,
            children: [{ path: "/catalogos/unidades-medida", element: <UnidadesMedidaPage /> }],
          },

          {
            element: <PermissionRoute permission="productos.ver" />,
            children: [
              { path: "/productos", element: <ProductosPage /> },
              { path: "/productos/:id", element: <ProductoDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permission="productos.crear" />,
            children: [{ path: "/productos/crear", element: <ProductoCreatePage /> }],
          },
          {
            element: <PermissionRoute permission="productos.editar" />,
            children: [{ path: "/productos/:id/editar", element: <ProductoEditPage /> }],
          },

          {
            element: <PermissionRoute permission="inventario.ver" />,
            children: [
              { path: "/inventario", element: <Navigate to="/inventario/stock" replace /> },
              { path: "/inventario/stock", element: <StockPage /> },
              { path: "/inventario/vencimientos", element: <VencimientosPage /> },
            ],
          },
          {
            element: <PermissionRoute permission="lotes.ver" />,
            children: [{ path: "/inventario/lotes", element: <LotesPage /> }],
          },
          {
            element: <PermissionRoute permission="inventario.entrada" />,
            children: [{ path: "/inventario/entrada", element: <EntradaInventarioPage /> }],
          },
          {
            element: <PermissionRoute permission="inventario.salida" />,
            children: [{ path: "/inventario/salida", element: <SalidaInventarioPage /> }],
          },
          {
            element: <PermissionRoute permission="inventario.ajuste" />,
            children: [{ path: "/inventario/ajuste", element: <AjusteInventarioPage /> }],
          },
          {
            element: <PermissionRoute permission="inventario.kardex" />,
            children: [{ path: "/inventario/kardex", element: <KardexPage /> }],
          },

          {
            element: <PermissionRoute permission="ventas.ver" />,
            children: [
              { path: "/ventas", element: <Navigate to="/ventas/historial" replace /> },
              { path: "/ventas/historial", element: <VentasHistorialPage /> },
              { path: "/ventas/cuentas-por-cobrar", element: <CuentasCobrarPage /> },
              { path: "/ventas/cuentas-por-cobrar/:id", element: <CuentaCobrarDetailPage /> },
              { path: "/ventas/pagos-clientes", element: <PagosClientePage /> },
              { path: "/ventas/devoluciones", element: <PlaceholderPage title="Devoluciones / anulaciones" /> },
              { path: "/ventas/:id", element: <VentaDetailPage /> },
            ],
          },

          {
            element: <PermissionRoute permission="comprobantes.notas_venta.ver" />,
            children: [{ path: "/comprobantes/notas-venta", element: <NotasVentaPage /> }],
          },
          {
            element: <PermissionRoute permission="sunat.comprobantes.ver" />,
            children: [
              { path: "/comprobantes", element: <Navigate to="/comprobantes/boletas" replace /> },
              { path: "/comprobantes/boletas", element: <BoletasPage /> },
              { path: "/comprobantes/facturas", element: <FacturasPage /> },
              { path: "/comprobantes/:id", element: <ComprobanteDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permissions={["sunat.notas.ver", "notas_credito.ver"]} />,
            children: [
              { path: "/comprobantes/notas-credito", element: <NotasCreditoPage /> },
              { path: "/comprobantes/notas-credito/:id", element: <NotaCreditoDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permissions={["sunat.notas.crear", "notas_credito.crear"]} />,
            children: [{ path: "/comprobantes/notas-credito/nueva", element: <NotaCreditoCreatePage /> }],
          },
          {
            element: <PermissionRoute permissions={["sunat.notas.ver", "notas_debito.ver"]} />,
            children: [
              { path: "/comprobantes/notas-debito", element: <NotasDebitoPage /> },
              { path: "/comprobantes/notas-debito/:id", element: <NotaDebitoDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permissions={["sunat.notas.crear", "notas_debito.crear"]} />,
            children: [{ path: "/comprobantes/notas-debito/nueva", element: <NotaDebitoCreatePage /> }],
          },
          {
            element: <PermissionRoute permission="sunat.guias.ver" />,
            children: [
              { path: "/comprobantes/guias-remision", element: <GuiasRemisionPage /> },
              { path: "/comprobantes/guias-remision/nueva", element: <GuiaRemisionCreatePage /> },
              { path: "/comprobantes/guias-remision/desde-venta", element: <GuiaDesdeVentaPage /> },
              { path: "/comprobantes/guias-remision/:id", element: <GuiaRemisionDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permissions={["sunat.resumenes.ver", "resumenes_diarios.ver"]} />,
            children: [
              { path: "/comprobantes/resumen-diario", element: <ResumenDiarioPage /> },
              { path: "/comprobantes/resumen-diario/:id", element: <ResumenDiarioDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permissions={["sunat.bajas.ver", "comunicaciones_baja.ver"]} />,
            children: [
              { path: "/comprobantes/comunicacion-baja", element: <ComunicacionBajaPage /> },
              { path: "/comprobantes/comunicacion-baja/:id", element: <ComunicacionBajaDetailPage /> },
            ],
          },

          {
            element: <PermissionRoute permission="caja.ver" />,
            children: [{ path: "/caja", element: <CajaPage /> }],
          },
          {
            element: <PermissionRoute permission="caja.historial" />,
            children: [{ path: "/caja/historial", element: <CajaHistorialPage /> }],
          },
          { path: "/compras", element: <Navigate to="/compras/proveedores" replace /> },
          {
            element: <PermissionRoute permission="proveedores.ver" />,
            children: [{ path: "/compras/proveedores", element: <ProveedoresPage /> }],
          },
          {
            element: <PermissionRoute permission="compras.ver" />,
            children: [
              { path: "/compras/registrar", element: <CompraCreatePage /> },
              { path: "/compras/historial", element: <ComprasHistorialPage /> },
              { path: "/compras/:id", element: <CompraDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permission="pagos_proveedor.ver" />,
            children: [
              { path: "/compras/pagos-proveedor", element: <PagosProveedorPage /> },
              { path: "/compras/pagos-proveedor/:id", element: <PagoProveedorDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permissions={["compras.ver", "cuentas_pagar.ver"]} />,
            children: [
              { path: "/compras/cuentas-por-pagar", element: <CuentasPagarPage /> },
              { path: "/compras/cuentas-por-pagar/:id", element: <CuentaPagarDetailPage /> },
            ],
          },
          {
            element: <PermissionRoute permission="pagos_proveedor.crear" />,
            children: [
              { path: "/compras/cuentas-por-pagar/:id/pagar", element: <PagoProveedorCreatePage /> },
            ],
          },
          {
            element: <PermissionRoute permission="sunat.ver" />,
            children: [{ path: "/sunat", element: <PlaceholderPage title="SUNAT" /> }],
          },
          {
            element: <PermissionRoute permission="reportes.ver" />,
            children: [
              { path: "/reportes", element: <ReportesPage /> },
              { path: "/reportes/ventas", element: <ReporteVentasPage /> },
              { path: "/reportes/compras", element: <ReporteComprasPage /> },
              { path: "/reportes/inventario", element: <ReporteInventarioPage /> },
              { path: "/reportes/caja", element: <ReporteCajaPage /> },
              { path: "/reportes/financiero", element: <ReporteFinancieroPage /> },
            ],
          },

          { path: "/configuracion", element: <Navigate to="/configuracion/empresa" replace /> },
          { element: <PermissionRoute permission="configuracion.empresa.ver" />, children: [{ path: "/configuracion/empresa", element: <EmpresaPage /> }] },
          { element: <PermissionRoute permission="tiendas.ver" />, children: [{ path: "/configuracion/tiendas", element: <TiendasPage /> }] },
          { element: <PermissionRoute permission="usuarios.ver" />, children: [{ path: "/configuracion/usuarios", element: <UsuariosPage /> }] },
          { element: <PermissionRoute permission="roles.ver" />, children: [{ path: "/configuracion/roles-permisos", element: <RolesPage /> }] },
          { element: <PermissionRoute permission="series.ver" />, children: [{ path: "/configuracion/series", element: <SeriesPage /> }] },
          {
            element: <PermissionRoute permission="sunat.configuracion.ver" />,
            children: [{ path: "/configuracion/sunat", element: <SunatConfiguracionPage /> }],
          },
          { element: <PermissionRoute permission="parametros.ver" />, children: [{ path: "/configuracion/parametros", element: <ParametrosPage /> }] },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
])





