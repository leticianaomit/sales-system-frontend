import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, skip, startWith, take } from 'rxjs/operators';
import { ResponseProductDTO } from 'src/app/core/models/product';
import { ProductsService } from 'src/app/core/services/products.service';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { MatOption } from '@angular/material/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { OrderItem } from 'src/app/core/models/order-item';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-item-form',
  templateUrl: './order-item-form.component.html',
  styleUrls: ['./order-item-form.component.scss'],
})
export class OrderItemFormComponent implements OnInit {
  @Output() whenItemAdded = new EventEmitter<OrderItem>();

  orderItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
    price: [{ value: null, disabled: true }, Validators.required],
    quantity: [{ value: null, disabled: true }, [Validators.required]],
  });
  orderItemControl = new FormControl();
  productList: ResponseProductDTO[] = [];
  filteredProducts!: ResponseProductDTO[];
  formattedPrice!: string;
  originalPrice: string = '';
  priceTextProfitability: string = '';

  orderItemControlSubscription!: Subscription;

  @ViewChild(MatAutocomplete) itemAutocomplete!: any;
  @ViewChild('priceStatus') priceStatus!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private currencyService: CurrencyService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private renderer: Renderer2
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

    this.orderItemForm?.get('quantity')?.addValidators([this.isMultiple()]);
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
      this.calculateProfitability();
    }
  }

  submitForm() {
    const form = this.orderItemForm.value;
    const item: OrderItem = form;

    this.whenItemAdded.emit(item);

    this.dialog.closeAll();
  }

  isMultiple = (): ValidatorFn => {
    return (control: AbstractControl) => {
      const quantity = control.value || 1;
      const productMultiple =
        this.orderItemForm.get('product')?.value?.multiple || 1;
      if (quantity % productMultiple !== 0)
        return { multiple: productMultiple };
      return null;
    };
  };

  async calculateProfitability(): Promise<void> {
    const originalPrice = this.orderItemForm.get('product')?.value?.price;
    const price = this.orderItemForm.get('price')?.value;

    let status = 'ORDERS.PROFITABILITY_STATUS.';
    let statusClassName = 'item-form__status-';
    if (price > originalPrice) {
      status += 'VERY_GOOD';
      statusClassName += 'very-good';
    } else {
      const originalPriceWithPercentage = originalPrice - originalPrice * 0.1;
      if (price >= originalPriceWithPercentage) {
        status += 'GOOD';
        statusClassName += 'good';
      } else {
        status += 'BAD';
        statusClassName += 'bad';
      }
    }

    this.priceTextProfitability = await this.translate.get(status).toPromise();
    this.renderer.setAttribute(
      this.priceStatus.nativeElement,
      'class',
      statusClassName
    );
  }
}
