import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResponseOrderDTO } from 'src/app/core/models/order';
import { OrdersService } from 'src/app/core/services/orders.service';
import { OrderViewComponent } from '../../components/order-view/order-view.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = ['client_name', 'actions'];
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions = [10, 20, 50, 100];

  orderListSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.orderListSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onClickBtnAddOrder() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  loadOrders() {
    this.ordersService.getOrderList();
    this.orderListSubscription = this.ordersService.orderList$.subscribe(
      (data) => {
        this.dataSource.data = data;
      }
    );
  }

  onClickBtnViewOrder(order: ResponseOrderDTO) {
    this.dialog.open(OrderViewComponent, {
      data: order,
      width: '600px',
      autoFocus: false,
    });
  }
}
