import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashierComponent } from './components/cashier/cashier/cashier.component';
import { CustomerComponent } from './components/customer/customer/customer.component';
import { KitchenComponent } from './components/kitchen/kitchen/kitchen.component';

const routes: Routes = [
  {path: 'customer', component: CustomerComponent},
  {path: 'cashier', component: CashierComponent},
  {path: 'kitchen', component: KitchenComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
