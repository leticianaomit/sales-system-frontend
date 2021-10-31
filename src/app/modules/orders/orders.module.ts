import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrderFormComponent } from './pages/order-form/order-form.component';
import { OrderItemFormComponent } from './components/order-item-form/order-item-form.component';

@NgModule({
  declarations: [
    OrderListComponent,
    OrderFormComponent,
    OrderItemFormComponent,
  ],
  imports: [CommonModule, OrdersRoutingModule, SharedModule],
})
export class OrdersModule {}
