import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { OrdersApiService } from '../http/orders-api.service';
import { ResponseOrderDTO } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private singularText: string = '';
  private pluralText: string = '';

  private orderList = new BehaviorSubject<ResponseOrderDTO[]>([]);
  orderList$ = this.orderList.asObservable();

  constructor(
    private ordersApiService: OrdersApiService,
    private snackbarService: SnackbarService,
    public translate: TranslateService
  ) {
    this.translate
      .get('ORDERS.TITLE_SINGLE')
      .pipe(take(1))
      .subscribe((res) => {
        this.singularText = res;
      });
    this.translate
      .get('ORDERS.TITLE')
      .pipe(take(1))
      .subscribe((res) => {
        this.pluralText = res;
      });
  }

  setOrderList(data: ResponseOrderDTO[]) {
    this.orderList.next(data);
  }

  getOrderList() {
    this.ordersApiService.getAll().subscribe(
      (data) => {
        this.setOrderList(data);
      },
      (_err) => {
        this.snackbarService.showFailureSnackbar(
          'CRUD_MESSAGES.READ.FAILURE_PLURAL',
          {
            type: this.pluralText.toLowerCase(),
          }
        );
      }
    );
  }

  saveOrder(order: ResponseOrderDTO): Promise<void> {
    return new Promise((resolve) => {
      this.ordersApiService
        .create(order)
        .pipe(take(1))
        .subscribe(
          async () => {
            this.snackbarService.showSuccessSnackbar(
              'CRUD_MESSAGES.CREATE.SUCCESS',
              {
                type: this.singularText,
              }
            );
          },
          async (_err) => {
            this.snackbarService.showFailureSnackbar(
              'CRUD_MESSAGES.CREATE.FAILURE',
              {
                type: this.singularText.toLowerCase(),
              }
            );
          },
          () => {
            resolve();
          }
        );
    });
  }
}
