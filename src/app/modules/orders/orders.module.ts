import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrdersRoutingModule } from './orders-routing.module';

@NgModule({
  declarations: [OrderListComponent],
  imports: [CommonModule, OrdersRoutingModule, SharedModule],
})
export class OrdersModule {}
