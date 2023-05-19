import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./component/layout/layout.component";


const routes: Routes = [
  { path: '', redirectTo: 'auth/iniciosesion', pathMatch: "full" },

  {
    path: 'auth',
    loadChildren: () =>
      import('./component/auth/auth.module').then((m) => m.AuthModule)
  },

  {
    path: 'panel', component: LayoutComponent,
    children: [
      {
        path: 'biblioteca',
        loadChildren: () =>
          import('./component/administracion/administracion.module').then((m) => m.AdministracionModule)
      }

    ]
  },


]


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
