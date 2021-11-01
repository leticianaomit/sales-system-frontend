import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, skip, startWith, take } from 'rxjs/operators';
import { ResponseProductDTO } from 'src/app/core/models/product';
import { ProductsService } from 'src/app/core/services/products.service';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { MatOption } from '@angular/material/core';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-order-item-form',
  templateUrl: './order-item-form.component.html',
  styleUrls: ['./order-item-form.component.scss'],
})
export class OrderItemFormComponent implements OnInit {
  orderItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
    price: [{ value: null, disabled: true }, Validators.required],
    quantity: [{ value: null, disabled: true }, Validators.required],
  });
  orderItemControl = new FormControl();
  productList: ResponseProductDTO[] = [];
  filteredProducts!: ResponseProductDTO[];
  formattedPrice!: string;
  originalPrice: string = '';

  orderItemControlSubscription!: Subscription;

  @ViewChild(MatAutocomplete) itemAutocomplete!: any;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.orderItemControlSubscription = this.orderItemControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filterByProductName(name) : this.productList.slice()
        )
      )
      .subscribe((res) => {
        this.filteredProducts = res;
      });
  }

  ngOnDestroy(): void {
    this.orderItemControlSubscription?.unsubscribe();
  }

  loadProducts() {
    this.productsService.getProductList();
    this.productsService.productList$
      .pipe(skip(1), take(1))
      .subscribe((res) => {
        this.productList = res;
        this.filteredProducts = res;
      });
  }

  getProductName(product: ResponseProductDTO): string {
    return product?.name ? product.name : '';
  }

  private _filterByProductName(name: string): ResponseProductDTO[] {
    const filterValue = name.toLowerCase();

    return this.productList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  transformPrice() {
    this.formattedPrice =
      this.currencyService.transform(this.formattedPrice) || '';
  }

  onProductSelected(option: MatOption) {
    if (option?.value?.id) {
      this.orderItemForm.get('price')?.enable();
      this.orderItemForm.get('quantity')?.enable();
      this.orderItemForm.patchValue({
        product: option.value,
        price: option.value.price,
        quantity: option.value.multiple,
      });
      this.originalPrice = option.value.price;
    }
  }
}
