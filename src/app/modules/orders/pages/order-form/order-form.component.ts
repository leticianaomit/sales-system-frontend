import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { take, skip, startWith, map } from 'rxjs/operators';
import { ResponseClientDTO } from 'src/app/core/models/client';
import { OrderItem } from 'src/app/core/models/order-item';
import { ClientsService } from 'src/app/core/services/clients.service';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { OrderItemFormComponent } from '../../components/order-item-form/order-item-form.component';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  displayedProductColumns = [
    'name',
    'original_price',
    'price',
    'quantity',
    'actions',
  ];
  dataSource = new MatTableDataSource<OrderItem>();

  orderControl = new FormControl();
  orderForm: FormGroup = this.fb.group({
    client: [null, Validators.required],
    items: [[], [Validators.required, Validators.minLength(1)]],
  });
  clientList: ResponseClientDTO[] = [];
  filteredClients!: ResponseClientDTO[];
  itemList: OrderItem[] = [];

  orderControlSubscription!: Subscription;
  dialogSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();

    this.orderControlSubscription = this.orderControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filterByClientName(name) : this.clientList.slice()
        )
      )
      .subscribe((res) => {
        this.filteredClients = res;
      });
  }

  ngOnDestroy(): void {
    this.orderControlSubscription?.unsubscribe();
  }

  loadClients() {
    this.clientsService.getClientList();
    this.clientsService.clientList$.pipe(skip(1), take(1)).subscribe((res) => {
      this.clientList = res;
      this.filteredClients = res;
    });
  }

  getClientName(client: ResponseClientDTO): string {
    return client?.name ? client.name : '';
  }

  private _filterByClientName(name: string): ResponseClientDTO[] {
    const filterValue = name.toLowerCase();

    return this.clientList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onClickBtnAddItem() {
    const dialog = this.dialog.open(OrderItemFormComponent, {
      width: '600px',
      autoFocus: false,
    });

    const dialogSubscription = dialog.componentInstance.whenItemAdded.subscribe(
      (item: OrderItem) => {
        this.itemList.push(item);
        this.updateItems();
      }
    );

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        dialogSubscription?.unsubscribe();
      });
  }

  onClickBtnEditItem(index: number, data: OrderItem) {
    const dialog = this.dialog.open(OrderItemFormComponent, {
      data,
      width: '600px',
      autoFocus: false,
    });

    const dialogSubscription = dialog.componentInstance.whenItemAdded.subscribe(
      (item: OrderItem) => {
        this.itemList.splice(index, 1, item);
        this.updateItems();
      }
    );

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        dialogSubscription?.unsubscribe();
      });
  }

  onClickBtnDeleteItem(index: number) {
    this.itemList.splice(index, 1);
    this.updateItems();
  }

  updateItems() {
    this.dataSource.data = this.itemList;
    this.orderForm.patchValue({ items: this.itemList });
  }

  onClientSelected(client: MatOption) {
    if (client?.value?.id) {
      this.setClient(client.value);
    }
  }

  setClient(data: ResponseClientDTO) {
    this.orderForm.patchValue({ client: data });
  }
}
