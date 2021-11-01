import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
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
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { priceStatusProfitability } from 'src/app/core/enums/order-item';

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
  priceStatusProfitability!: keyof typeof priceStatusProfitability;

  orderItemControlSubscription!: Subscription;

  @ViewChild(MatAutocomplete) itemAutocomplete!: any;
  @ViewChild('priceStatus') priceStatus!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) private itemData: OrderItem,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private currencyService: CurrencyService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private renderer: Renderer2
  ) {
    if (this.itemData) {
      this.originalPrice = this.itemData.product.price;
      this.formattedPrice = this.itemData.price;
      this.orderItemControl.setValue(this.itemData.product);
      this.setItem(
        this.itemData.product,
        this.itemData.price,
        this.itemData.quantity
      );
    }
  }

  ngOnInit(): void {
    this.orderItemForm?.get('quantity')?.addValidators([this.isMultiple()]);
    this.orderItemForm?.get('price')?.addValidators([this.isAllowedPrice()]);

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
      this.setItem(option.value, option.value.price, option.value.multiple);
    }
  }

  setItem(
    product: ResponseProductDTO,
    price: OrderItem['price'],
    quantity: OrderItem['quantity']
  ) {
    this.orderItemForm.get('price')?.enable();
    this.orderItemForm.get('quantity')?.enable();
    this.orderItemForm.setValue({
      product,
      price,
      quantity,
    });

    this.originalPrice = product.price;
    this.calculateProfitability();
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

    let status: keyof typeof priceStatusProfitability;
    if (price > originalPrice) {
      status = 'VERY_GOOD';
    } else {
      const originalPriceWithPercentage = originalPrice - originalPrice * 0.1;
      status = price >= originalPriceWithPercentage ? 'GOOD' : 'BAD';
    }

    this.priceTextProfitability = await this.translate
      .get('ORDERS.PROFITABILITY_STATUS.' + status)
      .toPromise();

    this.priceStatusProfitability = status;

    setTimeout(() => {
      this.renderer.setAttribute(
        this.priceStatus.nativeElement,
        'class',
        priceStatusProfitability[status]
      );
    }, 50);
  }

  isAllowedPrice = (): ValidatorFn => {
    return () => {
      if (this.priceStatusProfitability === 'BAD')
        return { pofitability: this.priceTextProfitability };
      return null;
    };
  };
}
