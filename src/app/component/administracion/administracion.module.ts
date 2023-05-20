import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { MaterialModule } from "../../../material/material.module";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from "@angular/common";
import { CrudClientesComponent } from './personas/CrudClientes/crud-clientes.component';
import { CrudUsuariosComponent } from './personas/CrudUsuario/crud-usuario.component';
import { CrearModificarUsuarioComponent } from './personas/CrudUsuario/NuevoModificarUsuario/crearModificarUsuario.component';
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
    path: 'administracionClientes',
    component: CrudClientesComponent
  },

  {
    path: 'creaModificaUsuario',
    component: CrearModificarUsuarioComponent
  },



]

@NgModule({
  declarations: [
    BienvenidaComponent,
    CrudClientesComponent,

    CrudUsuariosComponent,
    CrearModificarUsuarioComponent,


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



