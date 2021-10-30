import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ProductsApiService } from '../http/products-api.service';
import { ResponseProductDTO } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private singularText: string = '';
  private pluralText: string = '';

  private productList = new BehaviorSubject<ResponseProductDTO[]>([]);
  productList$ = this.productList.asObservable();

  constructor(
    private productsApiService: ProductsApiService,
    private snackbarService: SnackbarService,
    private translate: TranslateService
  ) {
    this.translate
      .get('PRODUCTS.TITLE_SINGLE')
      .pipe(take(1))
      .subscribe((res) => {
        this.singularText = res;
      });
    this.translate
      .get('PRODUCTS.TITLE')
      .pipe(take(1))
      .subscribe((res) => {
        this.pluralText = res;
      });
  }

  setProductList(data: ResponseProductDTO[]) {
    this.productList.next(data);
  }

  getProductList() {
    this.productsApiService.getAll().subscribe(
      (data) => {
        this.setProductList(data);
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
}
