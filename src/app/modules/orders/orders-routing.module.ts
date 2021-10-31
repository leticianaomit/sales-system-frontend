import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderFormComponent } from './pages/order-form/order-form.component';
import { OrderListComponent } from './pages/order-list/order-list.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent,
    pathMatch: 'full',
  },
  {
    path: 'add',
    component: OrderFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
