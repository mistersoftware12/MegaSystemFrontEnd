import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { MaterialModule } from "../../../material/material.module";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from "@angular/common";
import { CrudUsuariosComponent } from './personas/CrudUsuario/crud-usuario.component';
import { CrearModificarUsuarioComponent } from './personas/CrudUsuario/NuevoModificarUsuario/crearModificarUsuario.component';
import { ListarClienteComponent } from './personas/CrudCliente/Listar-Cliente/listar-cliente.component';
import { CrearModificarClienteComponent } from './personas/CrudCliente/Nuevo-Modificar-Cliente/crearModificarCliente.component';
import { ListarProveedorComponent } from './personas/CrudProveedor/Listar-Proveedor/listar-proveedor.component';
import { CrearModificarProveedorComponent } from './personas/CrudProveedor/Nuevo-Modificar-Proveedor/crearModificarProveedor.component';
import { ListarCategoriaComponent } from './categoria/Listar-Categoria/listar-categoria.component';
import { CrearModificarCategoriaComponent } from './categoria/Nuevo-Modificar-Categoria/crearModificarCategoria.component';
import { ListarProductoComponent } from './producto/Listar-Producto/listar-producto.component';
import { CrearModificarProductoComponent } from './producto/Nuevo-Modificar-Producto/crearModificarProducto.component';
import { CrearModificarIngresoProductoComponent } from './producto/Nuevo-Modificar-Ingreso/crearModificarIngresoProducto.component';
import { CrearModificarBajaProductoComponent } from './producto/Nuevo-Modificar-Baja/crearModificarBajaProducto.component';
import { ListarProduccionComponent } from './produccion/Listar-Produccion/listar-produccion.component';
import { CrearModificarProduccionComponent } from './produccion/Nuevo-Modificar-Produccion/crearModificarProduccion.component';
import { CrearModificarVentaComponent } from './venta/Nuevo-Modificar-Venta/crearModificarVenta.component';
import { ListarVentaComponent } from './venta/Listar-Venta/listar-venta.component';
import { ListarCreditosComponent } from './creditos/Clientes/Listar-Creditos/listar-credito.component';
import { CrearModificarCierreCajaComponent } from './caja/cierrecaja/Nuevo-Modificar-Cierre/crearModificarCierreCaja.component';
import { ListarCobroCajaComponent } from './caja/admin/Listar-Cobro/listar-cobro-caja.component';
import { ResumenGeneralComponent } from './caja/admin/Resumen-General/resumenGeneral.component';
import { ListaSubidaDataComponent } from './propietario/Listar-Subida/listar-subidaData.component';
registerLocaleData(localeEs, 'es')



const routes: Routes = [

  {
    path: 'bienvenida',
    component: BienvenidaComponent
  },

  {
    path: 'administracionusuarios',
    component: CrudUsuariosComponent
  },

  {
    path: 'creaModificaUsuario',
    component: CrearModificarUsuarioComponent
  },


  {
    path: 'administracionclientes',
    component: ListarClienteComponent
  },

  {
    path: 'creaModificarCliente',
    component: CrearModificarClienteComponent
  },

  {
    path: 'administracionproveedor',
    component: ListarProveedorComponent
  },

  {
    path: 'creaModificarProveedor',
    component: CrearModificarProveedorComponent
  },

  {
    path: 'administracioncategoria',
    component: ListarCategoriaComponent
  },

  {
    path: 'creaModificarCategoria',
    component: CrearModificarCategoriaComponent
  },

  {
    path: 'administracionProducto',
    component: ListarProductoComponent
  },

  {
    path: 'creaModificarProducto',
    component: CrearModificarProductoComponent
  },

  {
    path: 'creaModificarIngresoProducto',
    component: CrearModificarIngresoProductoComponent
  },

  {
    path: 'creaModificarBajaProducto',
    component: CrearModificarBajaProductoComponent
  },

  {
    path: 'administracionProduccion',
    component: ListarProduccionComponent
  },

  {
    path: 'creaModificarProduccion',
    component: CrearModificarProduccionComponent
  },

  {
    path: 'creaModificarVenta',
    component: CrearModificarVentaComponent
  },
  {
    path: 'administracionVenta',
    component: ListarVentaComponent
  },

  {
    path: 'administracionCredito',
    component: ListarCreditosComponent
  },
  {
    path: 'creaModificarCierreCaja',
    component: CrearModificarCierreCajaComponent
  },

  {
    path: 'administracionCobroCaja',
    component: ListarCobroCajaComponent
  },


  {
    path: 'resumenGeneral',
    component: ResumenGeneralComponent
  },

  {
    path: 'administracionSubidaData',
    component: ListaSubidaDataComponent
  },



]

@NgModule({
  declarations: [
    BienvenidaComponent,

    CrudUsuariosComponent,
    CrearModificarUsuarioComponent,

    ListarClienteComponent,
    CrearModificarClienteComponent,

    ListarProveedorComponent,
    CrearModificarProveedorComponent,

    ListarCategoriaComponent,
    CrearModificarCategoriaComponent,

    ListarProductoComponent,
    CrearModificarProductoComponent,

    CrearModificarIngresoProductoComponent,
    CrearModificarBajaProductoComponent,

    ListarProduccionComponent,
    CrearModificarProduccionComponent,

    CrearModificarVentaComponent,
    ListarVentaComponent,
    ListarCreditosComponent,


    CrearModificarCierreCajaComponent,
    ListarCobroCajaComponent,
    ResumenGeneralComponent,

    ListaSubidaDataComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})

export class AdministracionModule {

}



