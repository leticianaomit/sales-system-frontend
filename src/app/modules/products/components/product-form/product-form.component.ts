import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseProductDTO } from 'src/app/core/models/product';
import { ProductsService } from 'src/app/core/services/products.service';
import { CurrencyService } from 'src/app/shared/services/currency.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  idProduct!: string;
  productForm: FormGroup = this.fb.group({
    name: [null, Validators.required],
    price: [null, Validators.required],
    multiple: [null, Validators.pattern('^[0-9]*$')],
  });
  formattedPrice!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private productData: ResponseProductDTO,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private productsService: ProductsService,
    private currencyService: CurrencyService
  ) {
    if (this.productData?.id) {
      this.idProduct = this.productData.id;
      this.productForm.patchValue(this.productData);
    }
  }

  ngOnInit(): void {}

  submitForm() {
    const form = this.productForm.value;
    const product: ResponseProductDTO = form;

    if (this.idProduct) this.updateProduct(product);
    else this.saveProduct(product);

    this.dialog.closeAll();
  }

  refreshProductList() {
    this.productsService.getProductList();
  }

  private async updateProduct(product: ResponseProductDTO) {
    await this.productsService.updateProduct(this.idProduct, product);
    this.refreshProductList();
  }

  private async saveProduct(product: ResponseProductDTO) {
    await this.productsService.saveProduct(product);
    this.refreshProductList();
  }

  transformPrice() {
    this.formattedPrice =
      this.currencyService.transform(this.formattedPrice) || '';
  }
}
