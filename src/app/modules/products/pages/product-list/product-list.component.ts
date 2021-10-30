import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ResponseProductDTO } from 'src/app/core/models/product';
import { ProductsService } from 'src/app/core/services/products.service';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  tableColumns: any = [
    {
      label: 'Nome', //TODO: Add translate
      property: 'name',
      type: 'text',
    },
    {
      property: 'id',
      type: 'actions',
    },
  ];
  displayedColumns: string[] = ['name', 'id'];
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions = [10, 20, 50, 100];

  productListSubscription!: Subscription;
  dialogSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog ,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.productListSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadProducts() {
    this.productsService.getProductList();
    this.productListSubscription = this.productsService.productList$.subscribe(
      (data) => {
        this.dataSource.data = data;
      }
    );
  }

  onClickBtnAddProduct() {
    this.dialog.open(ProductFormComponent, {
      width: '600px',
      autoFocus: false,
    });
  }

  onClickBtnEditProduct(product: ResponseProductDTO) {
    this.dialog.open(ProductFormComponent, {
      data: product,
      width: '600px',
      autoFocus: false,
    });
  }

  onClickBtnDeleteProduct(id: ResponseProductDTO['id']) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '300px',
      autoFocus: false,
    });

    this.dialogSubscription?.unsubscribe();
    this.dialogSubscription =
      dialogRef.componentInstance.whenConfirmDelete.subscribe(() => {
        this.deleteProduct(id);
      });
  }

  async deleteProduct(id: string) {
    await this.productsService.deleteProduct(id);
    this.productsService.getProductList();
    this.dialog.closeAll();
  }
}
