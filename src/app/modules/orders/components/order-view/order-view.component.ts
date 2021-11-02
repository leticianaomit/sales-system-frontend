import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';
import { OrdersApiService } from 'src/app/core/http/orders-api.service';
import { ResponseOrderDTO } from 'src/app/core/models/order';
import { ResponseOrderItemDTO } from 'src/app/core/models/order-item';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent implements OnInit {
  displayedItemColumns = ['name', 'price', 'quantity'];
  dataSource = new MatTableDataSource<ResponseOrderItemDTO>();
  order: ResponseOrderDTO;

  constructor(
    @Inject(MAT_DIALOG_DATA) private orderData: ResponseOrderDTO,
    private ordersApiService: OrdersApiService
  ) {
    this.order = this.orderData;
  }

  ngOnInit(): void {
    this.ordersApiService
      .getItemsByIdOrder(this.order.id)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.dataSource.data = data;
        },
        (_err) => {
          console.log(_err);
        }
      );
  }
}
