import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-order-item-form',
  templateUrl: './order-item-form.component.html',
  styleUrls: ['./order-item-form.component.scss'],
})
export class OrderItemFormComponent implements OnInit {
  idClient!: string;
  orderItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
  });
  orderItemControl = new FormControl();
  productList: ResponseProductDTO[] = [];
  filteredProducts!: ResponseProductDTO[];

  orderItemControlSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService
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
}
