import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SignupComponent } from './auth/components/signup/signup.component'
import { LoginComponent } from './auth/components/login/login.component'
import { HomeComponent } from './home/home.component'
import { CommercialPagesComponent } from './commercial-pages/commercial-pages.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'estoque', redirectTo: 'customer/dashboard', pathMatch: 'full' },
  { path: 'register', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'financiamento', component: CommercialPagesComponent },
  { path: 'venda-seu-carro', component: CommercialPagesComponent },
  { path: 'contato', component: CommercialPagesComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./modules/customer/customer.module').then(m => m.CustomerModule)
  },
  { path: '**', redirectTo: '' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
