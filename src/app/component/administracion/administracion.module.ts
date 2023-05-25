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



