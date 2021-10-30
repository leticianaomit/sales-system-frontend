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

  saveProduct(product: ResponseProductDTO): Promise<void> {
    return new Promise((resolve) => {
      this.productsApiService
        .create(product)
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

  updateProduct(
    id: ResponseProductDTO['id'],
    product: ResponseProductDTO
  ): Promise<void> {
    return new Promise((resolve) => {
      this.productsApiService
        .update(id, product)
        .pipe(take(1))
        .subscribe(
          () => {
            this.snackbarService.showSuccessSnackbar(
              'CRUD_MESSAGES.UPDATE.SUCCESS',
              {
                type: this.singularText,
              }
            );
          },
          (_err) => {
            this.snackbarService.showFailureSnackbar(
              'CRUD_MESSAGES.UPDATE.FAILURE',
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

  deleteProduct(id: ResponseProductDTO['id']): Promise<void> {
    return new Promise((resolve) => {
      this.productsApiService
        .delete(id)
        .pipe(take(1))
        .subscribe(
          () => {
            this.snackbarService.showSuccessSnackbar(
              'CRUD_MESSAGES.DELETE.SUCCESS',
              {
                type: this.singularText,
              }
            );
          },
          (_err) => {
            this.snackbarService.showFailureSnackbar(
              'CRUD_MESSAGES.DELETE.FAILURE',
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
